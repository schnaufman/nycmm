---
permalink: /partner/
language: de
layout: page
title: Partner
ref: partner
menu: main,footer 
order: 4
---

<div class="c-page-partner grid-container">
  <div class="grid-x grid-padding-x grid-padding-y large-up-8 medium-up-6 small-up-4">
    {% for image in site.data.partner.images %}
      <div class="cell">
        <a href="{{ image.link }}" target="_blank"> 
          <img class="lazyload" src="{{image.lqip}}" data-src="/assets/img/partner/{{ image.file }}" alt="" width="{{ image.width }}" height="{{ image.height }}">
        </a>
      </div>
    {% endfor %}
  </div>
</div>
