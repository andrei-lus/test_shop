const express = require('express')
const app = express()
const Vue = require('vue')
const renderer = require('vue-server-renderer').createRenderer()
const fs = require('fs')

let items = [
    {id: 0, title: "Item 1", description: "First item description", price: 3000, image: "https://www.careersinafrica.com/wp-content/uploads/2020/05/placeholder.png"},
    {id: 1, title: "Item 2", description: "Second item description", price: 300, image: "https://www.careersinafrica.com/wp-content/uploads/2020/05/placeholder.png"},
    {id: 2, title: "Item 3", description: "Third item description", price: 30, image: "https://www.careersinafrica.com/wp-content/uploads/2020/05/placeholder.png"},
    {id: 3, title: "Item 4", description: "Fourth item description", price: 3, image: "https://www.careersinafrica.com/wp-content/uploads/2020/05/placeholder.png"},
]

const about_page = fs.readFileSync("about.template.html","utf-8")
const cart_page = fs.readFileSync("cart.template.html","utf-8")
const index_page = fs.readFileSync("index.template.html","utf-8")
const item_page = fs.readFileSync("item.template.html","utf-8")

const header = fs.readFileSync("assets/header.template.html","utf-8")

//  Routes
app.get("/", (req, res) => {
    render(index_page, {
        currentPage: 'h',
        items: items
    }, req, res)
})
app.get("/item/:id", (req, res) => {
    render(item_page, {
        item: items[parseInt(req.params.id)],
        isInCart: getCookies(req) === undefined ? false : getCookies(req)["cart"].includes(req.params.id)
    }, req, res)
})
app.get("/cart", (req, res) => {
    render(cart_page, {
        items: items,
        itemsInCart: getCookies(req).cart.split("+")
    }, req, res)
})
app.get("/about", (req, res) => {
    render(about_page, {
        currentPage: 'a'
    }, req, res)
})

//  Header and footer component
Vue.component("page-header", {
    template: fs.readFileSync("assets/header.template.html", "utf-8"),
    props: ["currentPage"]
})

//  Comfortable render function
function render(template, data, req, res) {
    const page = new Vue({
        data: data,
        template: template
    })
    renderer.renderToString(page, (err, html) => {
        res.send(html)
    })
}

//  Cookie getter function
const getCookies = (req) => {
    try {
        const rawCookies = req.headers.cookie.split('; ');
        const parsedCookies = {};
        rawCookies.forEach((rawCookie) => {
            const parsedCookie = rawCookie.split('=');
            parsedCookies[parsedCookie[0]] = parsedCookie[1];
        });
        return parsedCookies;
    } catch (e) {
        return undefined
    }
}

app.listen(8080)