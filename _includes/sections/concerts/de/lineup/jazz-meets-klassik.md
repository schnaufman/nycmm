{% assign first_act = concert.acts | first %}
{% assign last_act = concert.acts | last %}
### Jazz meets Klassik
#### Datum: {{ first_act.date.format | flatify }}, {{ first_act.date.time.begin }} - {{ last_act.date.time.end }}<br>Ort: {{ first_act.location }}
##### Konzerte mit dem Jazz Trio Prim sowie Gernot Bernroiders Culturessence im Rahmen des 'Jazz meets Klassik' Abend
