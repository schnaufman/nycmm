{% assign first_act = concert.acts | first %}
### Austrian Music Night
#### Datum: {{ first_act.date.format | flatify }}, Beginn: {{ first_act.date.time.begin }}<br>Ort: {{ first_act.location }}
##### Wir zelebrieren die österreichische Musiktradition: von der Klassik über das Wienerlied bis hin zur Folkmusik.<br>
