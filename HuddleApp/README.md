# capstone-project-3900w14bprospectivecustomers

# Project Name - HUDDLE

## 0. Change Log

- 11/06/2023: Completed the background and specification structure
- 04/08/2023: Completed the entire specification requirements

## 1. Background

Existing event management systems like Ticketmaster, Eventbrite, Ticketek, and Event Cinemas each have their unique offerings but also present certain challenges.

- Ticketmaster, with its diverse event display and recommendations, covers only four broad categories, with events presented in big blocks, lacking detailed descriptions or summaries.
- Eventbrite, despite its 'Follow Hosts' feature and personalized sections, bases recommendations mainly on selected tags. Additionally, event summaries are absent, providing only date, time, and location.
- Event Cinemas, largely focused on movies, offers a less personalized user experience. It provides no film summaries on the landing page, and locations are not effectively organized. Furthermore, the platform is ad-heavy and requires users to click through various pages for details.
- Lastly, Ticketek displays events primarily through images and banners, lacking essential information like event descriptions or categories.

These platforms collectively indicate a gap in providing a comprehensive and personalised event experience and their limitations underscore the need for our new Event Management System HUDDLE. HUDDLE aims to bridge these gaps by offering a comprehensive review mechanism, a detailed search function, and personalised recommendations. Our platform allows users to read and write detailed reviews, contributing to a transparent and community-driven event experience. This feedback loop helps potential attendees make more informed decisions and encourages hosts to improve their offerings.

## 2. Features

### 2.1 Feature 1 - User Management

The user management allows for all four types of users to access the system, these being:

- Prospective Customers,
- Customers (registered on Huddle),
- Hosts, and
- Admin.

Prospective customers can register their details to create a new account by entering their name, email, and password, which are saved to the platform, after which they are now customers and can log in using the email and password they created when registering.

There is also a password reset option on the log in page, where customers can enter the email that they registered with to receive an email with a link to reset their password if they forget it.

Logged in customers will be able to view their profile, where they can edit their personal details and preferences, view their badges and booked events on the calendar, and open chat channels that they have access to.

Similarly, a registered host account will be able to view their profile, where they can edit their personal details, and view their hosted events on the calendar.

The system administrator user when logged in has a central page which can delete events and users if there is any inappropriate content or users on the platform.

Each logged in session has a unique encrypted token which is removed upon logging out. This functionality gives all types of users a robust authentication system so that they can make an account to become customers of Huddle and safely create an event or make a secure booking if they wish to do so.

### 2.2 Feature 2 - Booking Management

The booking management allows for registered customers to book tickets and reserve seats to a listed event that they have selected that has not yet occurred. They can view the seating arrangement and select up to a maximum of five available seats within the seating layout that they want to book. This is so that all customers get a chance to get tickets to an event and prevent ticket scalpers.

The booking management takes the customer’s payment information and validates their credit card. The customer can also view the tickets that they have purchased and have an option to cancel a ticket to an event that has not yet occurred, which will automatically send the customer a cancellation email notification, refund the customer the booking costs, and make the refunded seat available again for another customer to select and book.

After booking tickets and navigating elsewhere, upon selecting the same event page again, the customer can view their booked tickets and can also book more tickets if they have not yet booked the maximum number of five seats. This functionality allows customers to book tickets for events that they want to attend, select the seats they want, and give them a refund if they change their mind about attending that event or booking a specific seat.

### 2.3 Feature 3 - Event Management

The event management functionality allows for users to view and create events on the platform.

Prospective customers, registered customers, and hosts can view events on the platform home page, which displays groups of events in an infinite scroll. Selecting an event card will display more information about that event. Any registered hosts can create an event. They can create an event listing which gets added to the home page and add details such as the event title, genre, venue, description, date, start time, end time, number of tickets, ticket price, note an 18+ event and upload a photo for the event.

Hosts who have created events can see these upcoming events on the calendar in their profile, and so can customers who have booked that event. Hosts also have an option to edit the details for the event and cancel an event which has not occurred yet, which automatically sends customers a notification that the event has been cancelled and refunds their booking cost. This functionality gives hosts an opportunity to advertise their event and inform customers of all the event details. At the same time, it makes the site interesting for prospective customers and customers as it allows them to view available events and get more details of any event that piques their interest.

### 2.4 Feature 4 - Search and Filter

The search functionality searches for events using the search bar and advanced filtering options on the home page.

The search bar searches for any event title based on given text input in the search bar from the user which can filter between current/future events or those events that have occurred in the past.

The advanced filter narrows down the scope of listed events with options to filter by description, type, price, and family friendly events. This functionality allows users to look up an event that they are interested in quickly and only show events that are relevant to their requirements such as events that may be family friendly or within a certain price.

There is also a tag for events on the homepage which filters the events into upcoming events and past events. This allows users to see upcoming events, and also an option to view all past events hosted on Huddle as well if they wish to do so.

### 2.5 Feature 5 - Reviews

The reviews functionality allows for customer reviews and host replies to an event that has already occurred. Customers who have booked a ticket for an event that is now past are able to leave one review for the event on the same event page, which involves a text input and a star rating. The review displays the customer’s name, review text, star rating, and timestamp that the review was posted.

Hosts can make one reply to each review that is posted to a past event that they created. Host replies displays the host’s name, reply text, and timestamp that the reply was made directly under the review that is replied to. All prospective customers, customers, and hosts can view and read reviews and host replies for a past event in an infinite scroll. The reviews functionality allows customers to be able to share their genuine thoughts about the event with other customers and prospective customers who may be considering attending an event from the same host. It also gives hosts an opportunity to reply to any inaccurate feedback or thank the customer and build their reputation as a host of great events.

### 2.6 Feature 6 - Reminders and Confirmation

The reminders and confirmation functionality sends registered customers who have made a booking email notifications automatically.

Customers receive a confirmation email when they have booked an event along with a copy of their ticket and booking details. If a customer cancels a ticket, they will receive a confirmation email for the cancellation and booking refund. This is so that it is clear to customers that they have made a successful booking or cancellation.

Customers with an event booking also get an email reminder for events that are about to occur within the next week and the day before. This ensures that customers will not forget about an event even with a busy schedule.

If a host cancels an event, any customers that have booked a ticket for that event will receive an email notification informing them that the event has been cancelled and for their ticket refund. This functionality ensures that customers are fully aware of their booking and informed of all details and any changes to their booking.

### 2.7 Feature 7 - Basic Recommmendation System

The recommendation functionality provides prospective customers and registered customers some suggested events. Registered customers who have made an event booking previously are given some suggested events that they may be interested in based on their past bookings.

Based on a booked past event’s description and type, any events similar in description or type will be suggested to the customer by automatically appearing on the home page carousel and will be the first listed events seen. If there are lots of recommended events, it is then further filtered to specific hosts of events that the user gave high review ratings to (3 stars or more) and prioritise that host’s events that have a similar description to the past events. This makes the recommendation system personalised to a user’s booking history and preferences. The events shown to prospective customers on the home page first are events that are almost fully booked (less than 10 seats remaining), so that they can get an idea of what events are currently trending and popular.

### 2.8 Feature 8 - Rewards and Gamification (Novel)

The rewards and gamification functionality is a novel functionality to encourage customers’ participation on the platform. At Huddle, we want to reward customers for actively being a part of the community. Thus, using a point-based system, customers can gain badges for participation.

Customers can get points for making bookings and writing reviews. Based on the genre of event that they make bookings in, customers can accumulate points in that category towards those badges that can be unlocked upon reaching a certain number of points.

In addition to unlocking badges for different types of events, each type of event has several tiers that come with additional perks, such as unlocking exclusive chat channels.

Customers can learn about how the badge system works through the badge help on the profile page where their badges are displayed.

Furthermore, customers can use their points to unlock discounts on future bookings. This gives customers an incentive to participate on Huddle.

### 2.9 Feature 9 - Similar Interest Group Chat (Novel)

The chat channels functionality is a novel functionality introduced in Huddle to create a sense of community and belonging for registered customers which allows customers to chat with other customers with similar interests in real time. There are several chat channels, each for a different theme.

Customers are placed into specific channels based on the event type that they booked the most events in. Customers are only able to send several messages at a time before the chat is disabled to prevent spam. As Huddle is a platform for users of all ages, there is also a profanity filter in the channels.

Ten messages load in a chat channel at a time, implemented with an infinite scroll. Increasing participation on the platform allows the customer to unlock additional channel features such as sending files, based on the tier that they are in. The chat channels functionality not only gives customers a platform to discuss upcoming events, but also an opportunity to share their experiences with other like-minded customers.

### 2.10 Feature 10 - FAQ Chatbot

We launched our very own HuddleBot which is designed for handling general frequently asked and answered questions that many users may face when using our platform. The chatbot detects keywords that determine the bot response which includes accepted payments, refund handling, cancellations, purchasing issues, ticket transfers, ticket delivery, booking limit and a general guide to getting started.
