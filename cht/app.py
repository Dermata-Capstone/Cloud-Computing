import os
from flask import Flask, request, jsonify, session
import requests

# Menyimpan API key langsung ke dalam kode
api_key = "AIzaSyAhAZX6r7BJob29Z8rXYAa4CUP2sQFgjmo"

if not api_key:
    raise ValueError("API key tidak ditemukan. Pastikan API key sudah diset.")

# URL endpoint Google Gemini API
gemini_endpoint = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={api_key}'

# Inisialisasi aplikasi Flask
app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Pastikan menggunakan secret key yang valid

@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Mengambil input dari body request (data JSON)
        user_input = request.json.get('text', None)  # Mengambil 'text' dari JSON
    except Exception as e:
        return jsonify({'error': f'Invalid JSON or missing field: {str(e)}'}), 400

    if not user_input:
        return jsonify({'error': 'No text provided'}), 400  # Pastikan 'text' ada dalam JSON

    # Membuat data untuk dikirim ke Google Gemini API
    data = {
        "contents": [{
            "parts": [{
                "text": user_input
            }]
        }]
    }

    # Set header untuk API request
    headers = {
        "Content-type": "application/json"
    }

    # Mengirim POST request ke API Gemini
    try:
        response = requests.post(gemini_endpoint, headers=headers, json=data, timeout=10)
        response.raise_for_status()  # Menaikkan error jika response tidak berhasil
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f"Request error: {str(e)}"}), 500

    # Mengecek status response
    if response.status_code == 200:
        # Jika berhasil, parsing data dan ambil response bot
        try:
            response_data = response.json()
            bot_response = response_data['candidates'][0]['content']['parts'][0]['text']
            
            # Menyimpan percakapan dalam sesi untuk referensi jika diperlukan
            if 'chat_history' not in session:
                session['chat_history'] = []
            
            # Menambahkan input user dan response bot ke dalam chat history
            session['chat_history'].append({'user': user_input, 'bot': bot_response})

            return jsonify({'response': bot_response}), 200
        except (KeyError, IndexError) as e:
            return jsonify({'error': 'Invalid response format from Gemini API'}), 500
    else:
        return jsonify({'error': f"Error {response.status_code}: {response.text}"}), response.status_code


@app.route('/end_chat', methods=['DELETE'])
def end_chat():
    # Menghapus seluruh data sesi
    session.clear()
    return jsonify({'message': 'Chat session ended and cleared'}), 200

# Menjalankan server Flask
if __name__ == '__main__':
    # Menangani PORT dengan benar jika menjalankan di cloud atau server lain
    port = int(os.environ.get("PORT", 8080))  # Default ke 8080 jika PORT tidak diset
    app.run(debug=True, host='0.0.0.0', port=port)
