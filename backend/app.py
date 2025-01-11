from flask import Flask, request, jsonify
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# SKU-to-name-and-price mapping for items
sku_to_item = {
    "3530089": {"name": "Chhole Bhature", "price": 12.99},
    "3530088": {"name": "Chhole Bhature", "price": 7.99},
    "3530087": {"name": "Kachori with Aloo Sabzi", "price": 6.99},
    "3530086": {"name": "Aloo Tikki - with Chhole", "price": 9.99},
    "3530082": {"name": "Paratha With Raita", "price": 5.99},
    "3530081": {"name": "Rice Bowl", "price": 9.99},
    "3530080": {"name": "Stuffed Kulcha", "price": 7.99},
    "3530083": {"name": "Pani Puri", "price": 7.99},
    "3530049": {"name": "Seasonal Thali", "price": 12.99},
    "3530048": {"name": "Deluxe Thali", "price": 15.99},
    "3530047": {"name": "Idli Vada Combo", "price": 7.99},
    "3530046": {"name": "Idli Sambhar", "price": 7.99},
    "3530045": {"name": "Vada Sambhar", "price": 9.99},
    "3530044": {"name": "Matar Kulcha", "price": 9.99},
    "3530043": {"name": "Vada Pav", "price": 8.99},
    "3530042": {"name": "Pav Bhaji", "price": 9.99},
    "3530041": {"name": "Boiled Rice", "price": 3.99},
    "3530040": {"name": "Pao", "price": 1.99},
    "3530039": {"name": "Puri", "price": 3.99},
    "3530038": {"name": "Bhatura", "price": 3.99},
    "3530037": {"name": "Laccha Paratha", "price": 4.99},
    "3530036": {"name": "Plain Naan", "price": 3.99},
    "3530035": {"name": "Garlic Naan", "price": 5.99},
    "3530034": {"name": "Butter Naan", "price": 4.99},
    "3530033": {"name": "Palak Paneer", "price": 12.99},
    "3530032": {"name": "Dal Makhani", "price": 12.99},
    "3530031": {"name": "Dal Tadka", "price": 12.99},
    "3530030": {"name": "Hyderabadi Chaap Gravy", "price": 12.99},
    "3530029": {"name": "Shahi Paneer", "price": 12.99},
    "3530028": {"name": "Mix Veg.", "price": 12.99},
    "3530027": {"name": "Chhole", "price": 12.99},
    "3530026": {"name": "Malai Rasgulla", "price": 5.99},
    "3530025": {"name": "Raj Bhog", "price": 4.99},
    "3530024": {"name": "Rabri Falooda", "price": 6.99},
    "3530023": {"name": "Rasmalai", "price": 6.99},
    "3530022": {"name": "Rasgulla", "price": 3.99},
    "3530021": {"name": "Gulab Jamun", "price": 4.99},
    "3530020": {"name": "Kulfi Falooda", "price": 6.99},
    "3530019": {"name": "Gur Rasmalai", "price": 5.99},
    "3530018": {"name": "Soda", "price": 1.99},
    "3530017": {"name": "Lassi", "price": 5.99},
    "3530016": {"name": "Bottle Water", "price": 0.99},
    "3530015": {"name": "Mango Lassi", "price": 5.99},
    "3530014": {"name": "Kesar Pista - Badam Milk", "price": 5.99},
    "3530013": {"name": "Masala Tea", "price": 2.99},
    "3530012": {"name": "Bhalla Papdi", "price": 8.99},
    "3530011": {"name": "Papdi Chaat", "price": 8.99},
    "3530010": {"name": "Dahi Bhalla", "price": 8.99},
    "3530009": {"name": "Raj Kachori", "price": 9.99},
    "3530008": {"name": "Samosa Chaat", "price": 8.99},
    "3530007": {"name": "Aloo Tikki", "price": 6.99},
    "3530006": {"name": "Khandvi Plate", "price": 4.99},
    "3530005": {"name": "Bread Pakora", "price": 4.99},
    "3530004": {"name": "Pyaz Kachori", "price": 5.99},
    "3530003": {"name": "Samosa Plate", "price": 4.99},
    "3530002": {"name": "Paneer Pakoda", "price": 4.99},
    "3530001": {"name": "Dal Kachori", "price": 4.99},
    "3539999": {"name": "Burger", "price": 4.99}
}


pizza_topping_to_item = {
    "onion": {"name": "Onion", "price": 1.25},
    "tomato": {"name": "Tomato", "price": 1.25},
    "bell_peppers": {"name": "Bell Peppers", "price": 1.25},
    "cheese": {"name": "Cheese", "price": 1.00},
    "mushroom": {"name": "Mushroom", "price": 0.75},
    "olives": {"name": "Olives", "price": 0.80},
    "sweet_corn": {"name": "Sweet Corn", "price": 1.25},
    "pepparani": {"name": "Pepparani", "price": 1.00},
}

burger_topping_to_item = {
    "onion": {"name": "Onion", "price": 1.25},
    "tomato": {"name": "Tomato", "price": 1.25},
    "lettuce": {"name": "Lettuce", "price": 1.25},
    "cheese": {"name": "Cheese", "price": 1.00},
    "mayo": {"name": "Mayo", "price": 0.25},
}


@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    data = request.json
    print("Add to cart data received:", data)

    args = data.get('args', {})
    items = args.get('items', [])

    valid_items = []
    for item in items:
        sku = item.get('sku')
        item_name = sku_to_item.get(sku, {}).get('name')
        if not item_name:
            continue  # Skip invalid SKUs

        # Determine the topping dictionary based on the item type
        topping_dict = None
        if "pizza" in item_name.lower():
            topping_dict = pizza_topping_to_item
        elif "burger" in item_name.lower():
            topping_dict = burger_topping_to_item

        toppings = []
        for topping in item.get('Toppings', []):
            topping_key = topping.get('topping_key')
            if topping_dict and topping_key in topping_dict:
                topping_details = topping_dict[topping_key]
                toppings.append({
                    "item_name": topping_details['name'],
                    "price": topping_details['price']
                })

        valid_items.append({
            "sku": sku,
            "item_name": item_name,
            "qty": item.get('qty'),
            "price": sku_to_item[sku]['price'],
            "notes": item.get('notes', ''),
            "Toppings": toppings
        })

    if not valid_items:
        return jsonify({"status": "error", "message": "No valid items to add to cart"}), 400

    response_data = {"items": valid_items}
    socketio.emit('update_cart', {"action": "add_to_cart", "data": response_data})

    return jsonify(response_data), 200


@app.route('/delete_from_cart', methods=['POST'])
def delete_from_cart():
    data = request.json
    print("Delete from cart data received:", data)

    # Extract relevant details from the received data
    args = data.get('args', {})
    sku = args.get('sku')

    if not sku or sku not in sku_to_item:
        return jsonify({"status": "error", "message": "Invalid SKU"}), 400

    # Broadcast delete event to all clients
    socketio.emit('update_cart', {"action": "delete_from_cart", "data": {"sku": sku}})
    return jsonify({"status": "success", "message": f"Item with SKU {sku} removed from cart"}), 200


@app.route('/payment', methods=['POST'])
def payment():
    data = request.json
    print("Payment data received:", data)

    # Extract the is_online flag from the data
    is_online = data.get('args', {}).get('is_online', False)

    # Broadcast payment event to all clients
    socketio.emit('proceed_to_payment', {"action": "proceed_to_payment", "is_online": is_online})
    return jsonify({"status": "success", "message": "Payment processed"}), 200

@app.route('/add_toppings', methods=['POST'])
def add_toppings():
    data = request.json
    print("Add toppings data received:", data)

    # Extract 'args' field
    args = data.get('args', {})
    topping = args.get('topping')
    quantity = args.get('quantity')

    # Validate required fields
    if not topping or not quantity:
        return jsonify({"status": "error", "message": "Missing required fields in 'args'"}), 400

    if topping not in topping_to_item:
        return jsonify({"status": "error", "message": f"Topping '{topping}' not found"}), 400

    # Fetch topping details
    topping_details = topping_to_item[topping]
    topping_name = topping_details['name']
    topping_price = topping_details['price']
    total_price = round(topping_price * quantity, 2)  # Calculate total price

    response_data = {
        "topping": topping_name,
        "quantity": quantity,
        "total_price": total_price
    }

    # Emit the updated toppings data to the frontend
    socketio.emit('update_toppings', {"action": "add_toppings", "data": response_data})

    # Respond with the calculated data
    return jsonify({"status": "success", "message": "Topping added", "data": response_data}), 200

@app.route('/delete_topping', methods=['POST'])
def delete_topping():
    data = request.json
    print("Delete toppings data received:", data)

    # Extract 'args' field
    args = data.get('args', {})
    topping = args.get('topping')

    # Validate required fields
    if not topping:
        return jsonify({"status": "error", "message": "Missing required fields in 'args'"}), 400

    if topping not in topping_to_item:
        return jsonify({"status": "error", "message": f"Topping '{topping}' not found"}), 400

    # Prepare response data
    response_data = {"topping": topping}

    # Emit the delete topping event to the frontend
    socketio.emit('update_toppings', {"action": "delete_topping", "data": response_data})

    # Respond with the delete topping message
    return jsonify({"status": "success", "message": "Topping removed", "data": response_data}), 200

if __name__ == "__main__":
    socketio.run(app, port=5000, debug=True)
