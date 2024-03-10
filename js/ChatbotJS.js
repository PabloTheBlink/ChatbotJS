import { Component } from "https://cdn.devetty.es/ScopeJS/js";

const TIME_INFO_MODAL = 1000 * 10;
const OPENED_BY_DEFAULT = false;
const API_URL = "https://api.devetty.es/chatbot";

const chatbot = Component({
  controller: function () {
    this.collapsed = !OPENED_BY_DEFAULT;
    this.show_info_modal = false;
    this.message = "";
    this.messages = [];
    this.fetching = false;
    this.showInfoModal = function () {
      if (!TIME_INFO_MODAL) return;
      setTimeout(() => {
        this.show_info_modal = true;
        this.apply();
        setTimeout(() => {
          this.show_info_modal = false;
          this.apply();
        }, TIME_INFO_MODAL);
      }, 1000);
    };
    this.init = function () {
      this.showInfoModal();
      sendMessage("hola", true);
    };
    this.openChatbot = function () {
      this.collapsed = false;
      this.apply();
    };
    this.closeChatbot = function () {
      this.collapsed = true;
      this.apply();
    };
    const sendMessage = (message, auto = false) => {
      if (message == "") return;
      if (!auto) {
        this.messages.push({
          from: 1,
          content: message,
        });
      }
      this.fetching = true;
      this.apply();
      fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ content: message }),
      })
        .then((r) => r.json())
        .then((r) => {
          this.messages.push({
            from: 2,
            content: r.data,
          });
          this.fetching = false;
          this.apply();
        });
    };
    this.sendMessage = function (e) {
      e.preventDefault();
      sendMessage(this.message);
      this.message = "";
      this.apply();
    };
    setTimeout(this.init.bind(this));
  },
  render: function () {
    return /* HTML */ `
      <div class="devetty-chatbot-container">
        <div class="devetty-chatbot-info-modal ${this.show_info_modal && this.collapsed ? "show-opacity" : ""}">
          <span>¿Necesitas ayuda?<br />Haz click en el logo.</span>
        </div>
        <button onclick="openChatbot()" class="devetty-chatbot-open-button ${this.collapsed ? "collapsed" : ""}"></button>
        <div class="devetty-chatbot-window ${this.collapsed ? "collapsed" : ""}"">
        	<div class="devetty-chatbot-window-header">
          	<h1>Chatbot</h1>
            <button onclick="closeChatbot()" class="devetty-chatbot-close-button">x</button>
          </div>
        	<div class="devetty-chatbot-messages-container">
          	${this.messages
              .map(
                (message) => /* HTML */ `
                  <div class="devetty-chatbot-message ${message.from == 1 ? "mine" : ""}">
                    <div class="devetty-chatbot-message-panel">${message.content}</div>
                  </div>
                `
              )
              .join("")}
          </div>
          <form onsubmit="sendMessage" class="devetty-chatbot-form">
          	<input ${this.fetching ? "disabled" : ""} model="message" placeholder="Escribe tu mensaje" type="text" />
            <button ${this.fetching ? "disabled" : ""}>v</button>
          </form>
        </div>
      </div>
    `;
  },
  postRender: function () {
    const messages_container = document.querySelector(".devetty-chatbot-container .devetty-chatbot-window .devetty-chatbot-messages-container");
    if (messages_container) messages_container.scrollTop = messages_container.scrollHeight;
    const input = document.querySelector(".devetty-chatbot-container .devetty-chatbot-window .devetty-chatbot-form input");
    if (input) input.focus();
  },
}).render();

document.body.appendChild(chatbot.DOM_element);
