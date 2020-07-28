Don't recommend them a climb that they've already ticked

If a climb is on their ticklist, let them know that it's already on their ticklist

1. use getTicks to get a list of most recent climbs
2. use getRoute to:
  a. find flash grade, send grade, and project grade
    i. flash grade = highest number of completed climbs within 2 grades (ex. v1-2)
    ii. send grade = next highest number of completed climbs within 2 grades (ex. v3-4)
    iii. project grade = 1-2 grades higher than send grade. (ex. v5-6)
3. Allow user to choose location on a map based on lat and long
  a. stretch: use google maps API to get location based on city or allow user to drop a pin on a map
4. recommend climbs within area of 'x' miles (can be set by user).
5. use getToDos to tell user if a climb is already on their to-do list



<UserData tickList={tickList} toDoList={toDoList} flashGrade={flashGrade} sendGrade={sendGrade} projectGrade={projectGrade} />

