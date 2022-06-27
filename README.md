# Speech To Text Prototype for The Rush Market

## Every Page Commands

- **Next/Previous Page:** if the page has the button,
  this will navigate you to the next/previous page
- **Control Voice:** then say...
  - **Pause:** stop voice from executing commands
  - **Resume:** have voice resume executing commands
  - **Stop:** end voice altogether

## Home Page Commands

- **Length:** the next number said will fill in the Length field
- **Depth:** the next number said will fill in the Depth field
- **Height:** the next number said will fill in the Height field
- **Add Note:** say anything and it will be added to the Notes field
  - **End Note(s):** this command will stop adding what you say to the Notes field

## Step 1 Commands

- **Supplier Code:** then say the supplier Code
  - **_Warning_** this command is still being worked on and does not currently perform enitirely correctly

## Step 2 Commmands

- **Correct, Yes, Yep, Yeah:** these commands will mark "Correct" for the section you are currently on
- **No, Incorrect, Wrong:** these commands will mark "Incorrect" for the section you are currently on
- **Verify All:** mark correct for everything in the page
- **Add Note:** say anything and it will be added to the Notes field
  - **End Note(s):** this command will stop adding what you say to the Notes field

## Step 3 Commands

- **Correct, Yes, Yep, Yeah:** these commands will mark "Yes" for the section you are currently on
- **No, Incorrect, Wrong:** these commands will mark "No" for the section you are currently on
- **Weight:** change the weight if you are on the Box Dimensions and Weights section
- **Dimensions:** then say the 3 dimensions, in no particular order, and they will be added to the box dimensions
- **New, Like New, Damaged, Trash:** mark the respective button in the product condition section
- _If the product is damaged..._
  - **No, Some, Most:** mark the respective choice for if the product is missing parts
  - **Top, Front, Corner, Sides:** mark said choice for where the damage is
  - **Bottom, Back:** mark said choice for where the damage is
  - **Interior:** mark said choice for where the damage is
  - **Clearly Visible, Hidden:** mark the respective choice for how visible the damage is
  - **Minor, Moderate, Considerable:** mark the respective choise for how sever the damage is
- **Add Note:** say anything and it will be added to
  the Notes field

  - **End Note(s):** this command will stop adding what you say to the Notes field

## Data Structure

- Uses a decision tree that works with a nested hashmap:
  - Adding to the data structure:
    - Can either add a word or word group at a time, if it is a word group, then all the words in the group will perform the same function
    - Function:
      - When adding commands, a function is also specified that the command will perform when voiced
