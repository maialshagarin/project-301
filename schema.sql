DROP TABLE  IF EXISTS numbertable;


CREATE TABLE IF NOT EXISTS numbertable (

number_id  SERIAL PRIMARY  KEY,
number text,
type VARCHAR(8000),
text VARCHAR(8000)
);
INSERT INTO numbertable (number, type, text) VALUES ('88', 'trivia', '88 is a standard length of playing cards in mm');