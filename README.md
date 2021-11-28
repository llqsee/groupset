# SetChange

```javascript
npm install

npm run server
```

Open the app at: http://localhost:3000/


TODO list:
- Fix the bug of sort;
- ~~Now is probably time to improve the change circles/numbers, what about using an horizontal stack chart and also include the 5 changes categories ? This would be consistant and easier to read~~
- ~~Also when we highlight the arrows we should use the color we use in the line chart to highlight segments~~
- I am also wondering if it happens change occure across 2 categories (eg from HIGH to LOW and not going through medium, this could be very interesting for the first days of the soccer rankings) 
- Regarding the rank by degree I think there should be a way to rank all the sets at once；
- ~~A final suggestion, could you also move the brushing to filter over the main line chart? I think we should not filter this main line chart and keep the brushing over it (but the lines below can be brushed) this will save some vertical space.~~
- ~~Add the global variance;~~
- ~~Optimize the workflow, to make it run fast;~~
- ~~Fix the sorting feature while no aggregate first;~~
- Highlight the between changes while hovering the subsets;
- ~~could you please fix the trafic dataset? I am meeting people familiar with this dataset today and want to do a study with them~~
- also we talked about cumulative either add the cumulative traffic (I remember you already did it) and an interesting case study could be https://observablehq.com/@fil/covid-19-derived-chart (not a priority but could illustrate the discussion at the end of the paper)
- then could you please add more soccer seasons?
- ~~the stacked chart of change is interesting but I find it difficult to understand the 2 vertical bars. Why don’t we only have one single vertical stack of bars? Adding up all the categories should be a 100% chart (if you include the stable changes)~~
- ~~could you add a mod without any aggregation at all? or is it what by degree does? so we would have each row as an element, eg. soccer team with no gray bar~~
- I am not sure we can make sens of the table, if you could add attribuets like in UpSet that would probably be interesting (simple boxplot of distirbution)
- ~~would be interesting to have a checkbox in the aggreagtion bar to filter the main view and only keep the elements from the aggregation group (the rest could be grayed out). this would be particularly useful for the MNIST dataset. this will also help to illustrate the paper.~~
- ~~could you include somewhere in the interface the interval of value for each category? near the names of categories could be a good place~~
- ~~Hover the set and get the global lines highlighted;~~
- ~~K-means~~
- ~~Traffic missing value;~~
- ~~Add between changes;~~
- ~~Add sorting by degree;~~
- ~~Add the second sort;~~
- ~~Highlight the changes of trends;~~
- ~~Add other filtering category;~~
- ~~Add the drop-down sorting methods;~~
- ~~Always keep the categories;~~
- ~~Add color option for users so they can add color for each categories;~~
- ~~let users create their own categories based on their own knowledge and name the categories;~~
- ~~highlight on all rows/colomns when the mouse hover a specific interval so it is easy to track  chagnes;~~
- ~~have the arrows as header and we should also can sort based on the arrows;~~
- ~~hightlight the lines when you hover the text in the top line chart;~~
- ~~add the option that don't aggregate;~~
- ~~Don't use two much colors to display the lines.~~
- ~~Show the context while brushing the time points;~~
- ~~Add distribution in the brushed area;~~
- ~~collapse and expand the groups;~~
- color the lines based on which categories that they belongs;
- ~~drag the lines to generate new categories;~~
- ~~add the predefined categories;~~
- ~~highlight the time points while hovering the groups;~~
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
- ~~Naming groups -> like fuzzycuts (but right now only for the main categories)~~
- Deviation attribute -> keep in mind we need to address it (either in the paper discussion or in the tool) but no action required at the moment
- ~~Ordering -> very important, should be done soon~~
- Evaluation: define a date for the first round (begining/mid november) + protocol/questions/datasets + schedule a second round late in november (that adressed the changes/suggestions from the first round)
- Click on the category ranks by this category see https://upset.app/interactive/
- ~~Fix MNIST bugs (too long to load, ..)~~