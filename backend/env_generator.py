import secrets

allowed_chars = [chr(i) for i in range(0x21, 0x7F)]
allowed_chars.remove("'")
allowed_chars.remove('"')
allowed_chars.remove('`')
key_length = 60

django_secret_key = ''.join(secrets.choice(allowed_chars) for i in range(key_length))
field_encryption_key = secrets.token_hex(32)
email_hash_key = secrets.token_hex(32)

print("SECRET_KEY='"+django_secret_key+"'")
print("EMAIL_HASH_KEY="+email_hash_key)
print("FIELD_ENCRYPTION_KEY="+field_encryption_key)