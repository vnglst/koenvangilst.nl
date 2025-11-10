---
title: Rising Temperatures in The Netherlands
publishedAt: '2023-12-16'
summary: >-
  Visualizing the weather anomalies in rainfall, sunshine and temperature in the
  Netherlands using data from the Dutch Meteorological Institute (KNMI).
image:
  src: /static/images/weather-anomalies.jpg
  alt: Graph showing temperature anomalies in the Netherlands
  width: 2558
  height: 1640
  showAsHeader: false
tags:
  - article
  - climate change
  - data visualization
date: '2023-12-16'
layout: layouts/post.njk
permalink: /lab/rising-temperatures/
---

Rarely a day goes by without some news of our changing climate. Here in the Netherlands, we're also experiencing this firsthand – our summers are hotter and our winters milder. In this blog post, I've tried to visually capture these changes. By using weather data from the Dutch Meteorological Institute (KNMI), I've created a series of visualizations that show how the average temperature, rainfall and sunshine in the Netherlands has changed since the 1900s.

## Yearly temperature anomalies

The three visualizations present the yearly anomalies in the Netherlands starting from 1906. The data, sourced from a [weather station in De Bilt](https://www.knmi.nl/over-het-knmi/nieuws/120-jaar-weerstation-de-bilt), is based on the average of each year, compared to the average during the period 1906-2000. This visualization is designed to be interactive, allowing users to hover over the graph to see the exact anomaly for each year.

I've also added a 10-year moving average to the graph, which shows the average temperature anomaly over 10 years. This helps to smooth out the graph and show the overall trend.

<WeatherAnomaly type="temperature" look="blog" />

<WeatherAnomaly type="rain" look="blog" />

<WeatherAnomaly type="sunshine" look="blog" />

## Heatmaps of anomalies

The second type of visualization shows the monthly anomalies in the Netherlands from 1906. I'm using a heatmap to visualize the data, where the color of each cell represents the anomaly for that month. So if you see a lot of red, it means that the temperature was higher than average; if it's blue, the temperature was lower than average.

The data is based on the average temperature of each month, compared to the average temperature of the period 1906-2000. Like the previous chart, the data is sourced from a [weather station in De Bilt](https://www.knmi.nl/over-het-knmi/nieuws/120-jaar-weerstation-de-bilt).

<WeatherHeatmap type="temperature" />

<WeatherHeatmap type="rain" />

<WeatherHeatmap type="sunshine" />

## Sources and methodology

To realize these visualizations, I've used [Apache ECharts](https://echarts.apache.org/en/index.html), a powerful open-source charting library. The code for these charts can be found [here](https://github.com/vnglst/koenvangilst.nl/tree/main/app/blog/rising-temperatures) and the data processing scripts in Python can be found [here](https://github.com/vnglst/dutch-climate-data/blob/main). The data is coming from the KNMI and can be found [here](https://cdn.knmi.nl/knmi/map/page/klimatologie/gegevens/daggegevens/etmgeg_260.zip).

The data used in these charts is updated daily, so the charts will always show the latest data. The data is sourced from a weather station in De Bilt, which is located in the center of the Netherlands. This means that the data is not representative of the entire country.

<Disclaimer>
  This article reached the Hacker News front page on December 16, 2023. If you're interested be sure to 
  [head over to the discussion](https://news.ycombinator.com/item?id=38663881), but brace yourself for some climate change skepticism. The article was also discussed on Reddit [here](https://www.reddit.com/r/thenetherlands/comments/18kgni7/rising_temperatures_in_the_netherlands/) and [here](https://www.reddit.com/r/dataisbeautiful/comments/18jqsl4/visualising_rising_temperatures_in_the_netherlands/).
</Disclaimer>

