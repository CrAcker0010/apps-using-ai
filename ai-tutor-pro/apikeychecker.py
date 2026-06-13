import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")
model = genai.GenerativeModel('gemini-1.5-flash')

try:
    response = model.generate_content("Is this key working?")
    print("Success:", response.text)
except Exception as e:
    print("Error:", e)
