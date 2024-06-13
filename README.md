# Christmas Shopping List Companion

This command line app is designed to help you with your shopping list this holiday season!

**Noteworthy features:**
- Adding items to shopping list full of possible gifts
- Adding items to a seperate theoretical shopping cart for gauging the total price of any combination of items
- Removing items from either list

## How to get started

1. Clone this repository
1. Fork and clone this repository.

1. Navigate to the cloned repository's directory on your command line. Then, run the following command:

    ```
    npm install
    ```

   This will install the libraries needed to run the program.

1. Open up the repository in VSCode and follow the guide below.

## Displaying items in your shopping lists:

**The `display` command will display the full contents of both lists:**

**Run the following command:**

- `npm run display`

## Adding items to your shopping lists

**To add an item to your main shopping list run this command:**

- `npm run add`

**To add an item to your sample shopping cart run this command:**

- `npm run enqueue`


## Removing items from your shopping lists

**To remove an item from your main shopping list run this command:**

- `npm run remove`

**To remove an item from your sample shopping cart run this command:**

- `npm run dequeue`

## Editing items in your main shopping list

The `edit` command allows you to re-enter the **name**, **category**, **price** and **in stock** status of any particular item

**Run the following command:**

- `npm run edit`