# Logic Document

##  Smart Assign Logic

I implemented a Smart Assign feature to fairly distribute tasks among users.

Here’s how it works :

- Whenever a user clicks the “Smart Assign” button while creating a task, the backend checks how many tasks each user currently has.
- It counts how many tasks are assigned to each user from the database.
- Then, it picks the user who has the **fewest tasks** assigned right now.
- The task gets automatically assigned to that user.

This helps prevent overloading one person while others have fewer responsibilities. It promotes fairness and balance in workload distribution.

> Example:
> - User A has 5 tasks, User B has 3 tasks, User C has 1 task  
> → Smart Assign will assign the new task to **User C**.


##  Conflict Handling Logic

Since this is a real-time collaborative board, I wanted to make sure that task updates from different users don’t cause conflicts.

Here’s how I handled it:

- The app uses **Socket.IO** to sync task updates across all connected users.
- Whenever a task is moved, updated, or deleted — a real-time event (`task-updated`) is emitted and everyone’s view is updated instantly.
- If two users try to update the same task at the same time, the **last update wins** (called Last Write Wins strategy).
- This prevents duplicate tasks or out-of-sync boards.

> Example Conflict:
> - User A moves Task 1 to “In Progress”
> - At the same time, User B deletes Task 1
> → The last action processed by the backend takes effect.  
> The real-time sync makes sure both users instantly see the result.

By combining real-time sync + a simple conflict resolution approach, I made sure that everyone stays on the same page.



##  Summary

Smart Assign ensures tasks are fairly distributed.  
Conflict Handling ensures that multiple users can safely collaborate in real time without breaking the app.

This logic made the board more reliable, user-friendly, and truly collaborative.
