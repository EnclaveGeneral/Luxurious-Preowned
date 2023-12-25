# Luxurious Pre-Owned Cars API Documentation
This API allows users to buy and see cars for sale at the Luxurious Pre-Owned website. They can see
prior transactions, sell their own cars, search/filter cars, and leave reviews on user pages.

## Attempt login
**Request Format:** /login

**Request Type:** POST

**Returned Data Format**: Plain text

**Description:** Attempts to log the user in by taking user/password information from the user.
Returns either the ID of the logged in user or a failure message.

**Example Request:** /login

**Example Response:**

```
1
```

**Error Handling:**
- Possible 400 (invalid request) error (plain text):
	- If missing username/password, returns error with message, 'Missing username/password'
	- If username/password don't match an existing user, returns plain text, 'Failure'
- Possible 500 (server-side) error (plain text):
	- If the server is experiencing issues, returns error message, 'Server seems to be down, please
	contact us at cdong@uw.edu.'

## Register new account
**Request Format:** /register

**Request Type:** POST

**Returned Data Format**: Plain text

**Description:** Attempts to register a new user by taking user/password/email information from the
user. Returns either with the name of the registered user or a failure message.

**Example Request:** /register

**Example Response:**

```
UserID: John Carseller
```

**Error Handling:**
- Possible 400 (invalid request) error (plain text):
	- If user with given username already exists, returns plain text, 'Username already exists'
- Possible 500 (server-side) error (plain text):
	- If the server is experiencing issues, returns error message, 'Server seems to be down, please
	contact us at cdong@uw.edu.'

## Get home page
**Request Format:** /cars

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns information about all cars on the site that are for sale to display on the
home screen. If given a search query, returns cars with names like the search term.

**Example Request:** /cars?=Black

**Example Response:**

```json
{
  'cars': [
		{
			'id': 1,
			'name': 'Black Ferrari F8 Tributo',
			'datemade': 2021,
			'fuel': 'gas',
			'type': 'sports',
			'price': 350000,
			'img': 'https://i.imgur.com/9KU4rlb.jpg',
			'descr': `A Almost-New pre-owned Ferrari for you to purchase! Comes in
								at only around $350,000 from an original MSRP of more than $6
								00,000! This is the one and only chance for you to take proper
								ownership of a magnificent beast of a machine!`,
			'selling': 'yes',
			'userid': 1
		},
		{
			'id': 2,
			'name': 'Black Honda Civic',
			'datemade': 2023,
			'fuel': 'gas',
			'type': 'sports',
			'price': 25000,
			'img': 'https://i.imgur.com/bWb8bwV.jpg',
			'descr': 'A good Honda',
			'selling': 'yes',
			'userid': 1
		}
	]
}
```

**Error Handling:**
- Possible 400 (invalid request) error (plain text):
	- If no cars are found and no search query was given, returns error message, 'No cars for sale
	found!'
	- If no cars are found and a search query was given, returns error message, 'No cars of that name/owner name found!'
- Possible 500 (server-side) error (plain text):
	- If the server is experiencing issues, returns error message, 'Server seems to be down, please
	contact us at cdong@uw.edu.'

## Search/filter cars
**Request Format:** /filter

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns filtered list of car information to display on the home screen. Takes
filter information if given from the user, including minimum and maximum price, fuel type, and car
type.

**Example Request:** /filter?min=100000&max=10000000&fuel=gas&type=sports

**Example Response:**

```json
{
  'cars': [
		{
			'id': 1,
			'name': 'Black Ferrari F8 Tributo',
			'datemade': 2021,
			'fuel': 'gas',
			'type': 'sports',
			'price': 350000,
			'img': 'https://i.imgur.com/9KU4rlb.jpg',
			'descr': `A Almost-New pre-owned Ferrari for you to purchase! Comes in
								at only around $350,000 from an original MSRP of more than $6
								00,000! This is the one and only chance for you to take proper
								ownership of a magnificent beast of a machine!`,
			'selling': 'yes',
			'userid': 1
		}
	]
}
```

**Error Handling:**
- Possible 400 (invalid request) error (plain text):
	- If no cars are found, returns error message, 'No cars matching params found!'
- Possible 500 (server-side) error (plain text):
	- If the server is experiencing issues, returns error message, 'Server seems to be down, please
	contact us at cdong@uw.edu.'

## See car information
**Request Format:** /car/:id

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns detailed car information for a specific car to show on that car's page.

**Example Request:** /car/1

**Example Response:**

```json
{
  {
		'id': 1,
		'name': 'Black Ferrari F8 Tributo',
		'datemade': 2021,
		'fuel': 'gas',
		'type': 'sports',
		'price': 350000,
		'img': 'https://i.imgur.com/9KU4rlb.jpg',
		'descr': `A Almost-New pre-owned Ferrari for you to purchase! Comes in
							at only around $350,000 from an original MSRP of more than $6
							00,000! This is the one and only chance for you to take proper
							ownership of a magnificent beast of a machine!`,
		'selling': 'yes',
		'userid': 1
	}
}
```

**Error Handling:**
- Possible 400 (invalid request) error (plain text):
	- If no ID is given, returns error message, 'Car ID was not given correctly.'
	- If no car was found, returns error message, 'Car of that ID was not found.'
- Possible 500 (server-side) error (plain text):
	- If the server is experiencing issues, returns error message, 'Server seems to be down, please
	contact us at cdong@uw.edu.'

## See user page
**Request Format:** /user/:id

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns cars for sale and the username for a specific user to show on that user's
page.

**Example Request:** /user/1

**Example Response:**

```json
{
	'cars': [
		{
			'id': 1,
			'name': 'Black Ferrari F8 Tributo',
			'datemade': 2021,
			'fuel': 'gas',
			'type': 'sports',
			'price': 350000,
			'img': 'https://i.imgur.com/9KU4rlb.jpg',
			'descr': `A Almost-New pre-owned Ferrari for you to purchase! Comes in
								at only around $350,000 from an original MSRP of more than $6
								00,000! This is the one and only chance for you to take proper
								ownership of a magnificent beast of a machine!`,
			'selling': 'yes',
			'userid': 1
		},
		{
			'id': 2,
			'name': 'Black Honda Civic',
			'datemade': 2023,
			'fuel': 'gas',
			'type': 'sports',
			'price': 25000,
			'img': 'https://i.imgur.com/bWb8bwV.jpg',
			'descr': 'A good Honda',
			'selling': 'yes',
			'userid': 1
		}
	],
	'username': 'John Carseller'
}
```

**Error Handling:**
- Possible 400 (invalid request) error (plain text):
	- If no ID is given, returns error message, 'User ID was not given correctly.'
	- If no user was found, returns error message, 'User ID does not match existing user.'
- Possible 500 (server-side) error (plain text):
	- If the server is experiencing issues, returns error message, 'Server seems to be down, please
	contact us at cdong@uw.edu.'

## See transaction history
**Request Format:** /history/:id

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns the transaction history of the given user.

**Example Request:** /history/2

**Example Response:**

```json
{
	'trx': [
		{
			'id': 8,
			'conf': 2,
			'date': 2023-12-06 22:05:46,
			'buyer': 2,
			'seller': 1,
			'car': 2
		}
	]
}
```

**Error Handling:**
- Possible 400 (invalid request) error (plain text):
	- If no ID is given, returns error message, 'User ID was not given correctly.'
	- If no transactions were found, returns error message, 'No transactions made yet.'
- Possible 500 (server-side) error (plain text):
	- If the server is experiencing issues, returns error message, 'Server seems to be down, please
	contact us at cdong@uw.edu.'

## Buy car
**Request Format:** /buy

**Request Type:** POST

**Returned Data Format**: Plain text

**Description:** Buys a specific car and stores the transaction information, including the date of
sale and the IDs of the users and car involved. Takes the ID of the buyer and the ID of the car.

**Example Request:** /buy

**Example Response:**

```
'Transaction #: 2, You can see the sale in your transaction history.'
```

**Error Handling:**
- Possible 400 (invalid request) error (plain text):
	- If a car of that ID was not found, returns error message, 'Car does not exist.'
	- If car has already been sold, returns error message, 'Car is not for sale.'
	- If the buyer is the same as the car's owner, returns error message, 'You cannot buy your own
	car.'
- Possible 500 (server-side) error (plain text):
	- If the server is experiencing issues, returns error message, 'Server seems to be down, please
	contact us at cdong@uw.edu.'

## Sell car
**Request Format:** /sell

**Request Type:** POST

**Returned Data Format**: Plain text

**Description:** Posts a new car for sale. Takes car information from the user, including the car
name, a picture, car type, fuel type, price, year of manufacturing, and description.

**Example Request:** /sell

**Example Response:**

```
Car has been put on sale! You can see the car on your account.
```

**Error Handling:**
- Possible 400 (invalid request) error (plain text):
	- If not all params were given, returns error message, 'Certain car information was not given!'
- Possible 500 (server-side) error (plain text):
	- If the server is experiencing issues, returns error message, 'Server seems to be down, please
	contact us at cdong@uw.edu.'