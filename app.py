from flask import Flask, render_template, send_from_directory, request, jsonify, redirect, url_for
from datetime import datetime, timedelta
import os
from flask_mail import Mail, Message
from dotenv import load_dotenv
import logging
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Configure caching for static files (7 days in seconds)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 7 * 24 * 60 * 60  # 7 days in seconds

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')  # Use os.getenv to load from .env
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')  # Use os.getenv to load from .env
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME')

# Initialize Flask-Mail
mail = Mail(app)

# Directory for storing messages if email fails
MESSAGES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'messages')
os.makedirs(MESSAGES_DIR, exist_ok=True)

@app.route('/')
def home():
    return render_template('index.html')

def save_message_to_file(name, email, message):
    try:
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        with open('contact_messages.txt', 'a') as f:
            f.write(f"[{timestamp}] Name: {name}, Email: {email}, Message: {message}\n")
        return True
    except Exception as e:
        logger.error(f"Error saving message to file: {str(e)}")
        return False

@app.route('/contact', methods=['POST'])
def contact():
    try:
        # Get form data
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        message = request.form.get('message', '').strip()

        # Validate form data
        if not name or not email or not message:
            return jsonify({
                'success': False, 
                'message': 'All fields are required'
            }), 400

        if not '@' in email or not '.' in email:
            return jsonify({
                'success': False, 
                'message': 'Please enter a valid email address'
            }), 400
            
        # Check if email credentials are configured
        email_configured = app.config['MAIL_USERNAME'] and app.config['MAIL_PASSWORD']
        
        if email_configured:
            try:
                # Create email message
                msg = Message(
                    subject=f'Portfolio Contact from {name}',
                    recipients=[app.config['MAIL_USERNAME']],
                    body=f'''
                    New contact form submission:
                    
                    Name: {name}
                    Email: {email}
                    
                    Message:
                    {message}
                    ''',
                    reply_to=email
                )

                # Send email
                mail.send(msg)
                logger.info(f"Email sent successfully from {email}")
                
                return redirect(url_for('home'))  # Redirect to home page on success
            except Exception as e:
                logger.error(f"Error sending email: {str(e)}")
                # Check for Gmail authentication error
                if "535" in str(e):
                    logger.warning("Gmail authentication failed. Check if App Password is correct and 2FA is enabled.")
                    # Try to save message locally as fallback
                    if save_message_to_file(name, email, message):
                        return redirect(url_for('home'))  # Redirect to home page on successful save
                    else:
                        return jsonify({
                            'success': False, 
                            'message': 'Failed to send message. Please try again later or contact directly via email.'
                        }), 500
                else:
                    # Try to save message locally as fallback for other errors
                    if save_message_to_file(name, email, message):
                        return redirect(url_for('home'))  # Redirect to home page on successful save
                    else:
                        return jsonify({
                            'success': False, 
                            'message': 'Failed to send message. Please try again later or contact directly via email.'
                        }), 500
        else:
            # Email not configured, save message to file
            if save_message_to_file(name, email, message):
                logger.info(f"Message from {email} saved to file (email not configured)")
                return redirect(url_for('home'))  # Redirect to home page on successful save
            else:
                return jsonify({
                    'success': False, 
                    'message': 'Failed to save your message. Please contact me directly via email.'
                }), 500

    except Exception as e:
        logger.error(f"Unexpected error in contact route: {str(e)}")
        return jsonify({
            'success': False, 
            'message': 'An unexpected error occurred. Please try again later or contact directly via email.'
        }), 500

# Custom route for serving videos with proper caching
@app.route('/static/videos/<path:filename>')
def serve_video(filename):
    return send_from_directory('static/videos', filename, 
                             mimetype='video/mp4',
                             max_age=7 * 24 * 60 * 60,  # 7 days in seconds
                             conditional=True)  # Enable conditional requests

if __name__ == '__main__':
    # Check if email credentials are set
    if not os.getenv('EMAIL_USER') or not os.getenv('EMAIL_PASSWORD'):
        logger.warning("Email credentials not found in environment variables. Contact form will use local file storage instead.")
    else:
        logger.info(f"Email configured with usernameoccan")
        logger.warning("If emails fail to send, check the following:")
        logger.warning("1. Make sure 'Less secure app access' is enabled in your Google account settings")
        logger.warning("2. If using 2FA, create an App Password instead of using your regular password")
        logger.warning("3. Check if your antivirus or firewall is blocking the connection")
    
    app.run(debug=True)