import json
import os
import time
import keyboard
import customtkinter as ctk
import webbrowser

KEY_IN_DELAY = 0.008
CHAR_LIMIT = 127
TEXT_CHAT_BUTTON = "t"

def split_chars(string: str, limit: int = CHAR_LIMIT) -> list:
    if len(string) <= limit:
        return [string]

    idx = 0
    last = limit
    lst = []

    while len(string[idx:]) >= limit:
        lst.append(string[idx:last])
        idx += limit
        last += limit
    lst.append(string[idx:last])

    return lst

def better_press(key: str) -> None:
    time.sleep(KEY_IN_DELAY)
    keyboard.press(key)
    time.sleep(KEY_IN_DELAY)
    keyboard.release(key)
    time.sleep(KEY_IN_DELAY)

def send_text():
    text = entry.get()
    if text:
        if len(text) > CHAR_LIMIT:
            for substr in split_chars(text):
                better_press(TEXT_CHAT_BUTTON)
                keyboard.write(substr, delay=KEY_IN_DELAY)
                better_press("enter")
        else:
            better_press(TEXT_CHAT_BUTTON)
            keyboard.write(text, delay=KEY_IN_DELAY)
            better_press("enter")

def bind_hotkeys():
    keyboard.add_hotkey('ctrl+1', send_text)

# Function to open the Discord link
def open_discord():
    try:
        webbrowser.open("https://discord.gg/PEjQMcuVBF")  # Replace with your Discord link
    except Exception as e:
        print("Failed to open Discord link:", e)

# CustomTkinter GUI setup
ctk.set_appearance_mode("dark")  # Dark mode for the app

root = ctk.CTk()  # Use CustomTkinter window

root.title("419 Chat Spammer")  # Set the window title
root.geometry("400x250")  # Set the window size

# Custom color for button and entry widgets
button_color = "#9b3d91"  # Magenta button color
button_hover_color = "#a74eab"  # Hover effect for the button
entry_bg_color = "#3c3c3c"  # Entry field dark color
entry_fg_color = "#ffffff"  # White text in the entry field
bg_color = "#2e2e2e"  # Dark background color

# Set the background color of the window
root.configure(bg=bg_color)

# Entry widget for user input
entry = ctk.CTkEntry(root, width=280, placeholder_text="Enter your text here", corner_radius=10, 
                     fg_color=entry_fg_color, bg_color=entry_bg_color)
entry.pack(padx=20, pady=20)

# Button to send text
send_button = ctk.CTkButton(root, text="Send Text", command=send_text, corner_radius=10, 
                            fg_color=button_color, hover_color=button_hover_color)
send_button.pack(padx=10, pady=10)

# Create a clickable label for the Discord link
discord_label = ctk.CTkLabel(root, text="Join our Discord", fg_color="transparent", 
                             text_color="#9b3d91", cursor="hand2")
discord_label.pack(padx=10, pady=20)

# Bind the open_discord function to the label click event
discord_label.bind("<Button-1>", lambda e: open_discord())  # Left-click event

# Bind hotkeys
bind_hotkeys()

# Start the CustomTkinter event loop
root.mainloop()

# Ensure keyboard events are handled in the background
keyboard.wait()
