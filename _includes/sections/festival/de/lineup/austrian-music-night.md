{% assign first_act = concert.acts | first %}

### {{ concert.title }}
#### Datum: {{ first_act.date.format | flatify }}, Beginn: {{ first_act.date.time.begin }}<br>Ort: {{ first_act.location }}
##### Wir zelebrieren die österreichische Musiktradition und ihre Neuinterpretationen – von der Klassik über Wiener Lieder bis hin zur Folk-und Weltmusik.
