{% assign page_about = site.pages | where:"language", page.language | where:"ref", "about" | first %}
{% assign page_festival = site.pages | where:"language", page.language | where:"ref", "festival" | first %}
{% assign contact_ref = site.data.lang[page.language].navigation.contact_id %}

##### Für Musikstudenten, vergeben wir _„International and National Scholarship Awards“_. Dieses Stipendium ermöglicht die freie Teilnahme am Workshop, sowie freien Eintritt zum Festival. Eure Bewerbung mailt uns bitte ein kurzes Video, sowie eine kurze Beschreibung über Euren Werdegang an <a href="mailto:nycmusikmarathon@gmail.com?subject=Scholarship">nycmusikmarathon@gmail.com</a>. Der Einsendeschluss ist der 25. Mai {{ "now" | date: "%Y" }}, die Gewinner geben wir am 30. Mai {{ "now" | date: "%Y" }} via e-mail und Facebook/Instagram bekannt.
##### Für einen Auftritt bei unserer „YOUNG MUSIC LIONS SERIES“ im Rahmen des [Festivals]({{ page_festival.permalink | relative_url }}) nehmen wir ebenfalls Bewerbungen in Form von Bandbio inklusive Video /Weblink entgegen.
<br>
##### Fragen hierzu könnt ihr uns über das [Kontaktformular]({{ page_about.permalink | relative_url }}#{{ contact_ref }}) stellen.
