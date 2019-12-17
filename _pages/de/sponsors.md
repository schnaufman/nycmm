---
permalink: /sponsoren/
language: de
layout: page
title: Sponsoren
ref: sponsors
order: 4
---

<div class="c-page-sponsors grid-container">
  <div class="grid-x grid-padding-x grid-padding-y large-up-4 medium-up-3 small-up-2"> 
    {% for image in site.data.sponsors.images %}
      <div class="cell">
        <a href="{{ image.link }}" target="_blank"> 
          <img class="lazyload" data-src="/assets/img/sponsors/{{ image.file }}" alt="">
        </a>
      </div>
    {% endfor %}
  </div>
</div>
