Hello! I have a problem in using pin in React. I don't know how the pin works internally, so it's hard for me to understand why the error occurs.

I have reduced the example as much as possible, and will try to explain what I want to do. Feel free to ask questions if I explain something poorly. I write through translator:

The elements are wrapped in a Cantainer component.

const App = () => {
return(
<Container>
<div className='el'>1</div>
<div className='el'>2</div>
<div className='el'>3</div>
</Container>

);
}
I want to remove container based on screen size. At the same time, elements inside the container should not be deleted.

function Container(props){
const [state,setState]=useState(true)

if(!state) return props.children

if(state)
return(
<section ref={ref}>
{props.children}
</section>
)
}
if state is true - render with container
if state is false - render without container

In useEffect I listen to the screen size and call setState when needed

This works great. But if I try to remove the Container component in which the Pin is set, I get an error:

Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node

Can I fix this? you can activate the pin in my example to see the error

Rodrigo
Rodrigo
Administrators
10.1k
1,335
Posted March 15, 2023
Hi,

The issue is that you're not reverting your ScrollTrigger instance when the element is removed, so ScrollTrigger has an instance and when you resize the screen, ScrollTrigger refreshes but the container is not there anymore. Just use GSAP MatchMedia and forget about the window matchmedia stuff:

useEffect(() => {
const mm = gsap.matchMedia();
mm.add("(max-width: 399px)", () => {
setState(false);
});
mm.add("(min-width: 400px)", () => {
setState(true);
gsap.to(ref.current, {
scrollTrigger: {
trigger: ref.current,
pin: true
}
});
});
return () => mm.revert();
}, []);
GSAP MatchMedia will take care of reverting and removing everything for you when the breakpoints are passed, super simple! ? ?

You can read more about it here:

https://greensock.com/docs/v3/GSAP/gsap.matchMedia()

Hopefully this helps.

Happy Tweening!

Like
2
Thanks
1
Romanus
Romanus
Members
48
Author
Posted March 16, 2023
This works very well in React! But I got a problem in Next js.

During the MatchMedia process, "ref" becomes "null". This is weird.

For clarity, I replaced the pin with background: blue. there are 2 examples. Next js and React.

stackblitz doesn't show an error for some reason. There is an error in my project. I print ref to console and get null

An error occurs in next js if the window is reduced and then enlarged

https://stackblitz.com/edit/nextjs-hauxvq?file=components%2FContainer.js,app%2Fpage.js

Screenshot_19.png

Rodrigo
Rodrigo
Administrators
10.1k
1,335
Solution
Posted March 16, 2023
Hi,

This solves the issue with the ref being null:

export default function Container(props) {
const ref = useRef();
const [state, setState] = useState(true);
useEffect(() => {
console.log("let's go", Date.now());
const mm = gsap.matchMedia();
mm.add('(max-width: 399px)', () => {
setState(false);
});
mm.add('(min-width: 400px)', () => {
setState(true);
if (!state) return;
gsap.to(ref.current, {
background: 'blue',
});
});
return () => mm.revert();
}, [state]);

if (!state) return props.children;

if (state) return <section ref={ref}>{props.children}</section>;
}
As for the other error, remember that NextJS uses UMD modules and not ES modules, so you have to import GSAP and it's plugins from the dist folder:

import gsap from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
gsap.registerPlugin(ScrollTrigger);
}
Hopefully this clear things up.

Happy Tweening!
