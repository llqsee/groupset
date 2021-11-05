# SetChange

```javascript
npm install

npm run server
```

Open the app at: http://localhost:3000/


TODO list:

- Show the context while brushing the time points;
- ~~Add distribution in the brushed area;~~
- ~~collapse and expand the groups;~~
- color the lines based on which categories that they belongs;
- drag the lines to generate new categories;
- add the predefined categories;
- highlight the time points while hovering the groups;
- ~~add labels for line chart in aggeragated sets;~~
- ~~add the sets with 0 elements;~~
- ~~add filter features for combination matrix;~~
- ~~add filter function for time points;~~
- ~~For the soccer dataset could you please flip the Y-axis so the 1st team is at the top?~~
- ~~By default you many not display the empty sets~~
- ~~MNIST seems to be very large right? probably load only a subset~~
- ~~An horizontal bar chart could display cardinality à la UpSet~~
- ~~Next step should be “order by” eg. set degree, cardinatily, which are standard and used in UpSet but also we now have partial sets so we may think of other ways to sort -> we need to define those in the paper first~~
- ~~Finally the group by feature is also interesting but can be seen as a double sort like in upset~~
- ~~Change the level of categories with a slider (instead of dragging). Think of pre-defined groups for each dataset (top-1 / top5 / bottom5 for soccer for example)~~
- Characterise by the last category over time: ex Rennes vs Lyon, same group, but the final group is important; to analyze variability; etc -> no implementation yet, we keep prototyping
- Hover row - > if on attribute view, highlight the row + filter line chart; if on upset matrix also highlight the column
- Hover column -> highlight the column + line chart
- ~~Hover line in the line chart -> highlight the corresponding rows and columns~~
- Naming groups -> like fuzzycuts (but right now only for the main categories)
- Deviation attribute -> keep in mind we need to address it (either in the paper discussion or in the tool) but no action required at the moment
- ~~Ordering -> very important, should be done soon~~
- Evaluation: define a date for the first round (begining/mid november) + protocol/questions/datasets + schedule a second round late in november (that adressed the changes/suggestions from the first round)
- Click on the category ranks by this category see https://upset.app/interactive/
- ~~Fix MNIST bugs (too long to load, ..)~~