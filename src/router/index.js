import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/dashboard/Dashboard.vue";
import Authentication from "../views/authentication/Authentication.vue";
import ContactUs from "../views/contact/ContactUs.vue";
import Profile from "../views/profile/Profile.vue";
import Newsletter from "../views/newsletter/Newsletter.vue";
import News from "../views/news/News.vue";
import Message from "../views/message/Message.vue";
import PickupService from "../views/pickup/PickupService.vue";
import Quote from "../views/quote/Quote.vue";
import About from "../views/about/About.vue";
import Services from "../views/services/Services.vue";
import Consignment from "../views/consignment/Consignment.vue";
import Client from "../views/client/Client.vue";
import ClientDetail from "../views/client/ClientDetail.vue";
import Invoice from "../views/invoice/Invoice.vue";
import InvoiceDetail from "../views/invoice/InvoiceDetail.vue";

import { auth } from "../firebase/db";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/authentication",
    name: "Authentication",
    meta: { layout: "auth-layout" },
    component: Authentication
  },
  {
    path: "/clients",
    name: "Client",
    component: Client,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/client/:id",
    name: "ClientDetail",
    component: ClientDetail,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/Invoices",
    name: "Invoice",
    component: Invoice,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/invoice-detail/:id",
    name: "InvoiceDetail",
    component: InvoiceDetail,
    meta: { layout: "auth-layout" }
  },
  {
    path: "/contact-information",
    name: "ContactUs",
    component: ContactUs,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/newsletter",
    name: "Newsletter",
    component: Newsletter,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/news",
    name: "News",
    component: News,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/message",
    name: "Message",
    component: Message,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/pickup-service",
    name: "PickupService",
    component: PickupService,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/quote-request",
    name: "Quote",
    component: Quote,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/about-us",
    name: "About",
    component: About,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/services",
    name: "Services",
    component: Services,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/consignment",
    name: "Consignment",
    component: Consignment,
    meta: {
      requiresAuth: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

// Protect Pages
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = auth.currentUser;
  if (requiresAuth && isAuthenticated == null) {
    next("/authentication");
  } else {
    next();
  }
});

export default router;
