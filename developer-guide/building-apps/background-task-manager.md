% Background Task Manager

Enyo 2.6 marks the introduction of several important new features, including the
Background Task Manager (`enyo.BackgroundTaskManager`, or "BTM" for short).

A typical Enyo application will have two levels of queues.  The top-level queue
manages a set of customers, each of which has its own individual queue of
tasks.  The top-level customer queue is what is handled by the BTM.

Each customer's queue of tasks is implemented with a priority queue
(`enyo.PriorityQueue`), such that the highest-priority task is always returned
quickly.  A related mixin, `enyo.TaskManagerSupport`, adds task manager
functionality, such as predefined `addTask()`, `removeTask()`, and
`updateTask()` methods, as well as stubs for `cancelTask()`, `pauseTask()`,
and `removeTask()` (since the latter methods are usually more domain-specific,
and thus less generalizable).

Each customer automatically registers itself with the BTM when it has 1 or more
tasks, and removes itself when it has 0 tasks.

When a given task has the special priority `enyo.Priorities.SOON`, the customer
managing that task is bumped to the front of the BTM queue.

Using a run loop (`enyo.Loop`), the BTM allows the customer at the front of the
line to execute a single task for each run.  This occurs when the BTM has
determined that the system is in an idle state (i.e., FPS meets a certain
threshold and there has been no recent user input from either the mouse or
keyboard).  Once the BTM allows the customer to execute a single task, the
customer is moved to the back of the queue, so that no customers become
unintentionally starved.

Apps will generally interface with this system at the customer level and should
not need to interact with the BTM directly.

An open question is whether a domain-specific app manager is needed.  In the
case of the Settings app, as users navigate throughout the app, task priorities
need to be updated to account for probable need (i.e., what the user is likely
to visit next).  A user who visits the Picture section is likely to drill down
into the Picture subpanels, so these should be given high priority.  But if the
user switches to the Sound section, then the Sound subpanels should be given
high priority.  This seems fairly domain-specific, so it may be best to leave
the implementation to the individual apps (at least for the time being).

For an example of how the BTM is used currently, see `enyo.LightPanels`.
