from openai import OpenAI
import io
import base64
from PIL import Image
import os
import dotenv
import numpy as np

dotenv.load_dotenv()

def gpt(prompt, images, model = "gpt-4o-mini"):
    # print("GPT CALLED")
    # return ["Yes", "No"]
    """
    Creates a chat completion using the OpenAI API, with a prompt and an array of images.

    Args:
        prompt (str): The text prompt to send to the API.
        images (list): A list of PIL Image objects.

    Returns:
        dict: Response object from the OpenAI API call.
    """
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # Start constructing the content
    content = [
        {
            "type": "text",
            "text": prompt
        }
    ]

    # For each image, encode it as a data URL and add to the content
    for image in images:
        # Encode the image as a data URL
        data_url = encode_image_as_data_url(image)
        # Add the data URL to the content
        content.append({
            "type": "image_url",
            "image_url": {"url": data_url}
        })

    # Construct the messages
    messages = [
        {
            "role": "user",
            "content": content
        }
    ]

    # Make the API call
    response = client.chat.completions.create(
        model= model,
        messages=messages,
        temperature=1,
        max_tokens=2048,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        response_format={
            "type": "text"
        }
    )

    return response.choices[0].message.content

def encode_image_as_data_url(image):
    """
    Encodes a PIL image as a data URL.

    Args:
        image (PIL.Image.Image): The image to encode.

    Returns:
        str: The data URL of the image.
    """
    # Convert the image to bytes
    img_byte_arr = io.BytesIO()
    # Default to 'PNG' if image format is not set
    image_format = image.format if image.format else 'PNG'
    image.save(img_byte_arr, format=image_format)
    img_bytes = img_byte_arr.getvalue()

    # Encode the image bytes to base64
    base64_encoded = base64.b64encode(img_bytes).decode('utf-8')

    # Construct the data URL
    mime_type = f"image/{image_format.lower()}"
    data_url = f"data:{mime_type};base64,{base64_encoded}"

    return data_url

# Example usage
if __name__ == "__main__":

    prompt = "What is this?"

    # create a let to right black and white gradient with numpy

    i = np.linspace(0, 1, 224)
    j = np.linspace(0, 1, 224)
    i, j = np.meshgrid(i, j)
    numpy_image = np.stack([i, j, np.zeros_like(i)], axis=-1)
    numpy_image = (numpy_image * 255).astype(np.uint8)
    pil_image = Image.fromarray(numpy_image, 'RGB')
    
    # Call the function
    response = gpt(prompt, [pil_image])

    # Print the response
    print(response)
