async function buildEventsTable(eventsTable, eventsTableHeader, token, message) {
    try {
      const response = await fetch("/api/v1/events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data.events.length, data.count)
      var children = [eventsTableHeader];
      if (response.status === 200) {
        if (data.events.length === 0) {
          eventsTable.replaceChildren(...children); // clear this for safety
          return 0;
        } else {
          for (let i = 0; i < data.events.length; i++) {
            let editButton = `<td><button type="button" class="editButton" data-id=${data.events[i]._id}>edit</button></td>`;
            let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.events[i]._id}>delete</button></td>`;
            let rowHTML = `<td>${data.events[i].eventName}</td><td>${data.events[i].eventDate}</td><td>${data.events[i].eventType}</td>${editButton}${deleteButton}`;
            let rowEntry = document.createElement("tr");
            rowEntry.innerHTML = rowHTML;
            children.push(rowEntry);
          }
          eventsTable.replaceChildren(...children);
        }
        return data.events.length;
      } else {
        message.textContent = data.msg;
        return 0;
      }
    } catch (err) {
      message.textContent = "A communication error occurred.";
      return 0;
    }
  }

document.addEventListener("DOMContentLoaded", () => {
    const logoff = document.getElementById("logoff");
    const message = document.getElementById("message");
    const logonRegister = document.getElementById("logon-register");
    const logon = document.getElementById("logon");
    const register = document.getElementById("register");
    const logonDiv = document.getElementById("logon-div");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const logonButton = document.getElementById("logon-button");
    const logonCancel = document.getElementById("logon-cancel");
    const registerDiv = document.getElementById("register-div");
    const name = document.getElementById("name");
    const email1 = document.getElementById("email1");
    const password1 = document.getElementById("password1");
    const password2 = document.getElementById("password2");
    const registerButton = document.getElementById("register-button");
    const registerCancel = document.getElementById("register-cancel");
    const events = document.getElementById("events");
    const eventsTable = document.getElementById("events-table");
    const eventsTableHeader = document.getElementById("events-table-header");
    const addEvent = document.getElementById("add-event");
    const editEvent = document.getElementById("edit-event");
    const eventName = document.getElementById("event-name");
    const eventDate = document.getElementById("event-date");
    const eventType = document.getElementById("event-type");
    const addingEvent = document.getElementById("adding-event");
    const eventsMessage = document.getElementById("events-message");
    const editCancel = document.getElementById("edit-cancel");
  
    // section 2 
    let showing = logonRegister;
    let token = null;
    document.addEventListener("startDisplay", async () => {
      showing = logonRegister;
      token = localStorage.getItem("token");
      if (token) {
        //if the user is logged in
        logoff.style.display = "block";
        const count = await buildEventsTable(
          eventsTable,
          eventsTableHeader,
          token,
          message
        );
        if (count > 0) {
          eventsMessage.textContent = "";
          eventsTable.style.display = "block";
        } else {
          eventsMessage.textContent = "There are no events to display for this user.";
          eventsTable.style.display = "none";
        }
        events.style.display = "block";
        showing = events;
      } else {
        logonRegister.style.display = "block";
      }
    });
  
    var thisEvent = new Event("startDisplay");
    document.dispatchEvent(thisEvent);
    var suspendInput = false;
  
    // section 3

    document.addEventListener("click", async (e) => {
        if (suspendInput) {
          return; // we don't want to act on buttons while doing async operations
        }
        if (e.target.nodeName === "BUTTON") {
          message.textContent = "";
        }
        if (e.target === logoff) {
          localStorage.removeItem("token");
          token = null;
          showing.style.display = "none";
          logonRegister.style.display = "block";
          showing = logonRegister;
          eventsTable.replaceChildren(eventsTableHeader); // don't want other users to see
          message.textContent = "You are logged off.";
        } else if (e.target === logon) {
          showing.style.display = "none";
          logonDiv.style.display = "block";
          showing = logonDiv;
        } else if (e.target === register) {
          showing.style.display = "none";
          registerDiv.style.display = "block";
          showing = registerDiv;
        } else if (e.target === logonCancel || e.target == registerCancel) {
          showing.style.display = "none";
          logonRegister.style.display = "block";
          showing = logonRegister;
          email.value = "";
          password.value = "";
          name.value = "";
          email1.value = "";
          password1.value = "";
          password2.value = "";
        } else if (e.target === logonButton) {
          suspendInput = true;
          try {
            const response = await fetch("/api/v1/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email.value,
                password: password.value,
              }),
            });
            const data = await response.json();
            if (response.status === 200) {
              message.textContent = `Logon successful.  Welcome ${data.user.name}`;
              token = data.token;
              localStorage.setItem("token", token);
              showing.style.display = "none";
              thisEvent = new Event("startDisplay");
              email.value = "";
              password.value = "";
              document.dispatchEvent(thisEvent);
            } else {
              message.textContent = data.msg;
            }
          } catch (err) {
            message.textContent = "A communications error occurred.";
          }
          suspendInput = false;
        } else if (e.target === registerButton) {
          if (password1.value != password2.value) {
            message.textContent = "The passwords entered do not match.";
          } else {
            suspendInput = true;
            try {
              const response = await fetch("/api/v1/auth/register", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: name.value,
                  email: email1.value,
                  password: password1.value,
                }),
              });
              const data = await response.json();
              if (response.status === 201) {
                message.textContent = `Registration successful.  Welcome ${data.user.name}`;
                token = data.token;
                localStorage.setItem("token", token);
                showing.style.display = "none";
                thisEvent = new Event("startDisplay");
                document.dispatchEvent(thisEvent);
                name.value = "";
                email1.value = "";
                password1.value = "";
                password2.value = "";
              } else {
                message.textContent = data.msg;
              }
            } catch (err) {
              message.textContent = "A communications error occurred.";
            }
            suspendInput = false;
          }
        } // section 4
        else if (e.target === addEvent) {
            showing.style.display = "none";
            editEvent.style.display = "block";
            showing = editEvent;
            delete editEvent.dataset.id;
            eventName.value = "";
            eventDate.value = "";
            eventType.value = "pending";
            addingEvent.textContent = "add";
          } else if (e.target === editCancel) {
            showing.style.display = "none";
            eventName.value = "";
            eventDate.value = "";
            eventType.value = "pending";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
          } else if (e.target === addingEvent) {
      
            if (!editEvent.dataset.id) {
              // this is an attempted add
              suspendInput = true;
              try {
                const response = await fetch("/api/v1/events", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    eventName: eventName.value,
                    eventDate: eventDate.value,
                    eventType: eventType.value,
                  }),
                });
                const data = await response.json();
                if (response.status === 201) {
                  //successful create
                  message.textContent = "The event entry was created.";
                  showing.style.display = "none";
                  thisEvent = new Event("startDisplay");
                  document.dispatchEvent(thisEvent);
                  eventName.value = "";
                  eventDate.value = "";
                  eventType.value = "errand";
                } else {
                  // failure
                  message.textContent = data.msg;
                }
              } catch (err) {
                message.textContent = "A communication error occurred.";
              }
              suspendInput = false;
            } else {
              // this is an update
              suspendInput = true;
              try {
                const eventID = editEvent.dataset.id;
                const response = await fetch(`/api/v1/events/${eventID}`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    eventName: eventName.value,
                    eventDate: eventDate.value,
                    eventType: eventType.value,
                  }),
                });
                const data = await response.json();
                if (response.status === 200) {
                  message.textContent = "The entry was updated.";
                  showing.style.display = "none";
                  eventName.value = "";
                  eventDate.value = "";
                  eventType.value = "errand";
                  thisEvent = new Event("startDisplay");
                  document.dispatchEvent(thisEvent);
                } else {
                  message.textContent = data.msg;
                }
              } catch (err) {
      
                message.textContent = "A communication error occurred.";
              }
            }
            suspendInput = false;
          } // section 5
          else if (e.target.classList.contains("editButton")) {
            editEvent.dataset.id = e.target.dataset.id;
            suspendInput = true;
            try {
              const response = await fetch(`/api/v1/events/${e.target.dataset.id}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });
              const data = await response.json();
              if (response.status === 200) {
                eventName.value = data.event.eventName;
                eventDate.value = data.event.eventDate;
                eventType.value = data.event.eventType;
                showing.style.display = "none";
                showing = editEvent;
                showing.style.display = "block";
                addingEvent.textContent = "update";
                message.textContent = "";
              } else {
                // might happen if the list has been updated since last display
                message.textContent = "The events entry was not found";
                thisEvent = new Event("startDisplay");
                document.dispatchEvent(thisEvent);
              }
            } catch (err) {
              message.textContent = "A communications error has occurred.";
            }
            suspendInput = false;
          }
          else if (e.target.classList.contains("deleteButton")) {
            suspendInput = true;
            try {
              const response = await fetch(`/api/v1/events/${e.target.dataset.id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });
              if (response.status === 200) {
                message.textContent = "The event entry was deleted.";
                showing.style.display = "none";
                thisEvent = new Event("startDisplay");
                document.dispatchEvent(thisEvent);
                eventName.value = "";
                eventDate.value = "";
                eventType.value = "errand";
              } else {
                // might happen if the list has been updated since last display
                message.textContent = "The events entry was not found";
                thisEvent = new Event("startDisplay");
                document.dispatchEvent(thisEvent);
              }
            } catch (err) {
              message.textContent = "A communications error has occurred.";
            }
            suspendInput = false;
          }
      })
  });