DROP TABLE IF EXISTS numbers;

CREATE TABLE  IF NOT EXISTS numbers (
            
number_id  SERIAL PRIMARY KEY,
number int,
text VARCHAR(255),
type VARCHAR(255),
found boolean 
);

INSERT INTO numbers (number_id,number,text,type,found) VALUES ('1','88',' 88 is a standard length of playing cards in mm','trivia','true');