{% assign page_about = site.pages | where:"language", page.language | where:"ref", "about" | first %}
{% assign page_festival = site.pages | where:"language", page.language | where:"ref", "festival" | first %}
{% assign contact_ref = site.data.lang[page.language].navigation.contact_id %}
{% assign deadline = section.scholarship.deadline %}

##### For music students, we award _"International and National Scholarship Awards"_. This scholarship allows free participation in the workshop, as well as free admission to the festival. For your application, please email us a short video, as well as a short description of your career to <a href="mailto:nycmusikmarathon@gmail.com?subject=Scholarship">nycmusikmarathon@gmail.com</a>. The deadline for submissions is {{ deadline.format | flatify }}, the winners will be announced via e-mail and Facebook/Instagram.
##### For a performance at our "YOUNG MUSIC LIONS SERIES" as part of the [Festivals]({{ page_festival.permalink | relative_url }}) we also accept applications in the form of Bandbio including video / web link.
<br>

##### You can ask us questions about this via the [contact form]({{ page_about.permalink | relative_url }}#{{ contact_ref }}).
