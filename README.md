# Speech To Text Prototype for The Rush Market

- Currently can take in a few commands like:

  - "Length": change the length field
  - "Depth": change the depth field
  - "Height": change the height field
  - "Add damage": add details to the damage text field
  - "End of damage": stop adding details to the damage text field
  - "Next page": when on the home page, navigate to the next page
  - "Previous page": when on the next page, navigate back to the home page

- Uses a data structure that works similar to a nested hashmap:
  - Adding to the data structure:
    - Can either add a word or word group at a time, if it is a word group, then all the words in the group will perform the same function
  - Function:
    - When adding commands, a function is also specified that the command will perform
