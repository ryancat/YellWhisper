# YellWhisper

YellWhisper is a view library to connect loosely coupled components via messages in different levels. As the name suggests, a component will simply yell to notice higher level components, and whisper to notice lower level ones. Upon hear the message (with optional data), the receiver component can react by changing states, deciding if it needs to re-render in DOM, or simply ignoring it. 

There has long been discussion on event driven workflow and state driven workflow, each has pros and cons based on the usecases. Service bus or message bus are broadly used by distributed system to achieve non-blocking service and good scalability, but in front end development, we want not only loosely coupled services/components, but also stateful workflow so that everything is predicatble and reproducible. 

YellWhisper tries to take the good part of the two approaches and use messages to connect components, and keep the state only inside each components. That means even parent component has no clue what's going on in its children components, unless they yell to their parent with information from inside. As such, there is nothing like a presenter or controller -- every component is self contained, stateful unit that has a pair of ear to hear, and a big mouth to speak. 

# To Be Continued...
