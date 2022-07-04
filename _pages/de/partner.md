---
permalink: /partner/
language: de
layout: page
title: Partner
ref: partner
menu: main,footer 
order: 6
---

<div class="c-page-partner grid-container">
  <div class="grid-x grid-padding-x grid-padding-y large-up-6 medium-up-6 small-up-4">
    {% for image in site.data.partner.images %}
      <div class="cell">
        <a href="{{ image.link }}" target="_blank"> 
          <img class="lazyload" src="{{image.lqip}}" data-src="/assets/img/partner/{{ image.file }}" alt="" width="300" height="90">
        </a>
      </div>
    {% endfor %}
  </div>
</div>
