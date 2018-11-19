---
layout: page
show_meta: false
languages: en
title: "Style your content!"
subheadline: "Layouts of Feeling Responsive"
header:
   image_fullwidth: "header_unsplash_5.jpg"
permalink: "/en/design/"
---
<ul>
    {% for post in site.categories.design %}
    <li><a href="{{ site.url }}{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
</ul>