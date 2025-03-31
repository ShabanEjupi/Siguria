<!-- filepath: c:\xampp\htdocs\KoreaDrive\index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KoreaDrive.ks - Your Gateway to Korean Cars</title>
    <link rel="stylesheet" href="./assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://www.flaticon.com/free-icons/car">
    
    <style>
        /* Add your custom styles here */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }
        header {
            background-color: #333;
            color: #fff;
            padding: 10px 0;
            text-align: center;
        }
        .car-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            padding: 20px;
        }
        .car-card {
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin: 10px;
            padding: 10px;
            width: 300px;
            text-align: center;
        }
        .car-card img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    <header>
        <h1>KoreaDrive.ks</h1>
        <p>Your Gateway to Korean Cars in Pristina</p>
    </header>
    
    <main>
        <section class="car-list">
            <div class="car-card">
                <img src="./assets/img/car1.jpg" alt="Car Model 1">
                <h2>Car Model 1</h2>
                <p>Price: $20,000</p>
                <button>View Details</button>
            </div>
            <div class="car-card">
                <img src="./assets/img/car2.jpg" alt="Car Model 2">
                <h2>Car Model 2</h2>
                <p>Price: $25,000</p>
                <button>View Details</button>
            </div>
            <!-- Add more car cards as needed -->
        </section>
    </main>

    <footer>
        <p>&copy; 2023 KoreaDrive.ks. All rights reserved.</p>
    </footer>
</body>
</html>