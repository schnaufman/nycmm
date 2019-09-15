{% assign first_act = concert.acts | first %}
### Workshop Abschlusskonzerte 
#### Datum: {{ first_act.date.format | flatify }}, Beginn: {{ first_act.date.time.begin }}<br>Ort: {{ first_act.location }}
##### Workshop Abschlusskonzert mit unseren TeilnehmerInnen 
