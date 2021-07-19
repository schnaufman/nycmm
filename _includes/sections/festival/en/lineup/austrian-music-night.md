{% assign first_act = concert.acts | first %}

### {{ concert.title }}
#### Datum: {{ first_act.date.format | flatify }}, Beginn: {{ first_act.date.time.begin }}<br>Ort: {{ first_act.location }}
