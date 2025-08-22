## src/data/mockImages.ts
Contains mock data that will be fetched from the API endpoint:</br>
`GET` All Images in an Album
## src/utils/groupByYear.ts
Groups images by year and returns a record like:</br>
`{ 2018: 2, 2019: 3, 2020: 1 }`
## src/ui/Timeline.tsx
`const total` is responsible for the total count of all images.</br>
`const proportion` calculates percentage height.</br>
`totalScrollHeight` & `currentScroll`</br>
Total scroll height of the gallery (px)</br>
and current scrollTop (px), passed from parent 
## src/utils/groupImages.ts
**groupImagesByYear:**
Groups images by year of creation.
`@param` images - Array of images
`@returns` An object with years as keys and arrays of images as values
**getYearCounts:**
Returns a map of year to image count.
`@param` groups - Object returned by groupImagesByYear