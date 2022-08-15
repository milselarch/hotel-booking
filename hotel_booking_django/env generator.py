import secrets

# debug is 0 by default. Change to 1 to see debug messages.
DEBUG="0"

# Fill in your MySQL DB credentials here.
DB_NAME=""
DB_USER=""
DB_PASSWORD=""
DB_HOST=""
DB_PORT=""

allowed_chars = [chr(i) for i in range(0x21, 0x7F)]
key_length = 60

django_secret_key = ''.join(secrets.choice(allowed_chars) for i in range(key_length))
field_encryption_key = secrets.token_hex(32)
email_hash_key = secrets.token_hex(32)

with open(".env", "w") as fout:
    fout.write("SECRET_KEY="+django_secret_key+"\n")
    fout.write("DEBUG="+ DEBUG + "\n")
    fout.write("EMAIL_HASH_KEY="+email_hash_key+"\n")
    fout.write("FIELD_ENCRYPTION_KEY="+field_encryption_key+"\n")
    fout.write("DB_NAME="+DB_NAME+"\n")
    fout.write("DB_USER="+ DB_USER+ "\n")
    fout.write("DB_PASSWORD="+ DB_PASSWORD+ "\n")
    fout.write("DB_HOST="+ DB_HOST+ "\n")
    fout.write("DB_PORT="+ DB_PORT)