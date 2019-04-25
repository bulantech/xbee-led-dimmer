
// Variables
unsigned long previousMillis = 0;
const long interval = 5000;

int lampPin = 3; //analogWrite() pins 3, 5, 6, 9, 10, and 11 
int nodeID = 1;
String command = "";


/* nodeID 1 test command
 * on
 * 0,f,1,o,15,a,v,400,E
 * off
 * 0,f,1,f,15,a,v,400,E
 * auto
 * 0,f,1,a,15,a,v,400,E
 */
 
// the setup function runs once when you press reset or power the board
void setup() {
  Serial.begin(9600);
  Serial.println("Start..");
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(LED_BUILTIN, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)
    delay(10);                       // wait for a second
    digitalWrite(LED_BUILTIN, LOW);    // turn the LED off by making the voltage LOW
//    delay(1000);                       // wait for a second
  }

  getCommand();
}

void getCommand() {
  char incomingByte = 0;   // for incoming serial data
  
  // send data only when you receive data:
  if (Serial.available() > 0) {
    // read the incoming byte:
    incomingByte = Serial.read();
    command += incomingByte;
    
    // say what you got:
//    Serial.print("I received: ");
//    Serial.println(incomingByte);

    if(incomingByte == 'E') { //end command
      Serial.println(">>>");
      
      splitData(command);
      command = "";
    }
    
  }
}

void splitData(String command) {
  Serial.print("command: ");
  Serial.println(command);

  String strSearch = "";
  String result = "";
  int index = 0;
  
  strSearch = String(nodeID);
  index = command.indexOf(strSearch); //find nodeID
  if(index < 0) {
    Serial.println("nodeID not foud");
    return;
  }
  result = command.substring(index, index+strSearch.length());
  Serial.println("nodeID: " + result);
  result = command.substring(index+strSearch.length()+1, index+strSearch.length()+2);
  Serial.println("state: " + result);
  String state = result;

  strSearch = String("v");
  index = command.indexOf(strSearch); //find value
  if(index < 0) {
    Serial.println("value not foud");
    return;
  }
  
  strSearch = "E";
  int index2 = command.indexOf(strSearch); //find value
  if(index2 < 0) {
    Serial.println("E end char not foud");
    return;
  }
  result = command.substring(index+2, index2-1);
  Serial.println("value: " + result);
  int ldrValue = result.toInt();

  ldrBlink(ldrValue, state);
}

void ldrBlink(int ldrValue, String state) {  
  Serial.print("ldrValue: ");
  Serial.println(ldrValue);
  
  int ldrValueBuff;

  if(ldrValue >= 1000) ldrValueBuff = 255;
  else if(ldrValue >= 850) ldrValueBuff = 212;
  else if(ldrValue >= 700) ldrValueBuff = 170;
  else if(ldrValue >= 550) ldrValueBuff = 127;
  else if(ldrValue >= 400) ldrValueBuff = 85;
  else if(ldrValue >= 250) ldrValueBuff = 42;
  else ldrValueBuff = 0;
  
  if(state == "o") {
    analogWrite(lampPin, 255);
    Serial.println("analogWrite = 255" );
  } else if(state == "f") {
    analogWrite(lampPin, 0);
    Serial.println("analogWrite = 0");
  } else {
    analogWrite(lampPin, ldrValueBuff);
    Serial.println("analogWrite = " + String(ldrValueBuff));
  }
  
  digitalWrite(LED_BUILTIN, LOW);  

}
