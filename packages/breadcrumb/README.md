# Breadcrumb

### Install

```js
meteor add theara:breadcrumb
```

### Usage

You need to add a parameter to your iron routes which are 

```js
breadcrumb: {
    title: "....", // String or Function
    parent: "..." 
}
```

- Example Iron Route with multiple levels

In this example the Breadcrumb would look or the url `/dashboard/analytics/books` like: `Dashboard / Analytics / Category Books`

```js
// Level 0
Router.route('/', {
    name: 'dashboard',
    template: 'dashboard',
    breadcrumb: {title: 'Dashboard'}
});

// Level 1
Router.route('/dashboard/analytics', {
    name: 'dashboard.analytics',
    template: 'dashboardAnalytics',
    breadcrumb: {
        title: 'Analytics'
        parent: 'dashboard', // this should be the name variable of the parent route
    }  
});

// Level 2
Router.route('/dashboard/analytics/books', {
    name: 'dashboard.analytics.books',
    template: 'dashboardAnalyticsBooks',
    breadcrumb: {
        title: 'Category Books'
        parent: 'dashboard.analytics', // this should be the name variable of the parent route
    }  
});
```

- Example Dynamic Iron Route

In this example the Breadcrumb would look for the url `/post/hello-world` like: `Home / Blogpost Hello-World`

```js
Router.route('/', {
    name: 'home',
    template: 'home',
    breadcrumb: {
        title: 'Home'
    }  
});

Router.route('/post/:_name', {
    name: 'post',
    template: 'singleBlogPost',
    breadcrumb: {
        title: 'Blogpost :_name', // the variable :_name will be automatically replaced with the value from the url
        parent: 'home' // this should be the name variable of the parent route
    }  
});
```

- Example custom template for navigation

Please note, that you dont have to use a custom template with the name `breadcrumb`, you can use the existing one out of the box by simply using `{{> breadcrumb}}` to include the preexisting template (which looks exact like the following example) anywhere in your own templates.

```
<ol class="breadcrumb">
    {{#each Breadcrumb}}
        {{#if cssClasses}}
            <li class="{{cssClasses}}">{{title}}</li>
        {{else}}
            <li><a href="{{url}}">{{title}}</a></li>
        {{/if}}
    {{/each}}
</ol>
```

- Example access of the breadcrumb in Javascript

```
if (Meteor.is_client) {
    Template.analytics.rendered = function(){
        console.log(Breadcrumb.getAll()); // you can access the breadcrumb objects in a template helper as well
    }
}
```

### Changelog
- v 0.0.2 (2015-07-14)
    - update readme
- v 0.0.1 (2015-07-13)
    - init
