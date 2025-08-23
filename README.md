**Gallery (The Source):** When we scroll inside the gallery, its onScroll prop calls the handleScroll function.

The handleScroll function's only job is to update the state (setScrollProgress, setCurrentYear).

**CustomScrollbar (The Display):** This component will receive scrollProgress and currentYear as props to know where to position its thumb and what year to display in its tooltip.

## src/data/mockImages.ts
Contains mock data that will be fetched from the API endpoint:</br>
`GET` All Images in an Album

## src/components/Gallery.tsx
The `data-year` attribute is added so we can measure the position of each year section.

## src/components/Timeline.tsx
`const total` is responsible for the total count of all images.</br>
`const proportion` calculates percentage height.</br>
`totalScrollHeight` & `currentScroll`</br>
Total scroll height of the gallery (px)</br>
and current scrollTop (px), passed from parent 

## src/utils/groupImages.ts
**groupImagesByYearMonth:**
Groups images by year and month of creation.
```ts
{
  "2024": {
    "October": [ { id, date_created }, ... ],
    "March": [ ... ]
  },
  "2023": {
    "November": [ ... ]
  }
}
```
`@param` images - Array of images
`@returns` An object with years as keys and arrays of images as values

**getYearCounts:**
Returns a map of year to image count.
`@param` groups - Object returned by groupImagesByYear
