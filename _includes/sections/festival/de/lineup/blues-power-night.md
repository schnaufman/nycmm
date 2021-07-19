{% assign first_act = concert.acts | first %}

### {{ concert.title }}
#### Datum: {{ first_act.date.format | flatify }}, Beginn: {{ first_act.date.time.begin }}<br>Ort: {{ first_act.location }}

##### Ein außergewöhnliches, musikalisches Gespann, dessen Songwriting an die Tedeschi Trucks Band oder an die legendären Allman Brothers erinnert und das mit Southern-Rock, Gospel, Soul, Blues, etwas Country und Balladen, in selten gewordener, atmosphärischer Dichte, ein einfühlsames, berührendes und bewegendes Konzerterlebnis verspricht.