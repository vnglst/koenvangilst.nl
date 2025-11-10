---
title: Adding Tailwind CSS to a Phoenix project
publishedAt: '2021-12-27'
summary: >-
  With the official mix task it has become very easy to add Tailwind to any
  Phoenix project. To make it even more straightforward I've written this quick
  step-by-step guide.
tags:
  - article
  - elixir
  - phoenix
  - tailwind
  - css
date: '2021-12-27'
layout: layouts/post.njk
permalink: /lab/adding-tailwind-to-phoenix/
---

Last week the Phoenix team published an [installer](https://github.com/phoenixframework/tailwind/) that allows you to add Tailwind CSS to your project without adding NPM or any other additional dependencies. I gave it a try over the weekend, but I ran into some issues. To make it easier for others I've written this step-by-step guide to get you up and running.

I'm new to Phoenix myself, so I tried to spell out every step I took. Even things that are (probably) obvious to more experienced Phoenix developers. For people that want to skip to the end, here's a link to the [result of this tutorial on Github](https://github.com/vnglst/phoenix_tailwind).

## Start with a new project

Create a new Phoenix project by running the following command:

```bash
mix phx.new phoenix_tailwind
```

Answer `yes` to install the dependencies and follow the instructions to start the Phoenix app.

## Installing Tailwind

Next, we'll add the new Tailwind dependency to our project. In the `mix.exs` file, add the following to the `deps` section:

```elixir {4}
  defp deps do
    [
      {:phoenix, "~> 1.6.4"},
      {:tailwind, "~> 0.1", runtime: Mix.env() == :dev},
      {:phoenix_ecto, "~> 4.4"},
      {:ecto_sql, "~> 3.6"},
      {:postgrex, ">= 0.0.0"},
      {:phoenix_html, "~> 3.0"},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:phoenix_live_view, "~> 0.17.5"},
      # etc...
    ]
  end
```

In `config/config.exs` specify the Tailwind version you want to use:

```elixir {10-19}
    config :esbuild,
        version: "0.13.5",
        default: [
            args:
            ~w(js/app.js --bundle --target=es2017 --outdir=../priv/static/assets --external:/fonts/* --external:/images/*),
            cd: Path.expand("../assets", __DIR__),
            env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
        ]

    config :tailwind,
        version: "3.0.7",
        default: [
            args: ~w(
            --config=tailwind.config.js
            --input=css/app.css
            --output=../priv/static/assets/app.css
            ),
            cd: Path.expand("../assets", __DIR__)
        ]

    # Configures Elixir's Logger
    config :logger, :console,
        format: "$time $metadata[$level] $message\n",
        metadata: [:request_id]
```

In the `assets` folder, create a `tailwind.config.js` file with:

```javascript
// See the Tailwind configuration guide for advanced usage
// https://tailwindcss.com/docs/configuration
module.exports = {
  content: ['./js/**/*.js', '../lib/*_web.ex', '../lib/*_web/**/*.*ex'],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms')]
};
```

Run the following command to install the new Tailwind dependency:

```bash
mix deps.get
```

And then run the Tailwind task:

```bash
mix tailwind.install
mix tailwind default
```

## Adding a Tailwind watcher

During development we want the Tailwind CLI to keep watching our files for changes. We'll add the following watcher to our `config/dev.exs` file:

```elixir {2}
  watchers: [
    tailwind: {Tailwind, :install_and_run, [:default, ~w(--watch)]},
    # Start the esbuild watcher by calling Esbuild.install_and_run(:default, args)
    esbuild: {Esbuild, :install_and_run, [:default, ~w(--sourcemap=inline --watch)]}
  ]
```

## Adding minification for production builds

In production we want Tailwind to minify our CSS files. To make this happen, update the following line in the `mix.exs` file:

```elixir {4}
  defp aliases do
    [
      setup: ["deps.get"],
      "assets.deploy": ["esbuild default --minify", "tailwind default --minify", "phx.digest"]
    ]
  end
```

## Loading Tailwind

We're ready with the configuration on the Phoenix side. All we have to do now is make sure the Tailwind classes get loaded in our main `assets/css/app.css` file:

```css {1-9}
@tailwind base;
@tailwind components;
@tailwind utilities;

/* import './phoenix.css'; */

body {
  @apply bg-gray-900;
}

/* Alerts and form errors used by phx.new */
```

I've had to remove the default styling from Phoenix (i.e. `Phoenix.css`), as I couldn't get it to work with Tailwind. There's an [open issue for this on Github](https://github.com/phoenixframework/tailwind/issues/8) and I'll update this tutorial accordingly if there's a solution.

I've also changed the body styling here to illustrate that the `@apply` functionality works (and to make the page look nice). Since Tailwind is now taking care of our CSS, we should comment out the following line in `assets/js/app.js`:

```javascript {3}
// We import the CSS which is extracted to its own file by esbuild.
// Remove this line if you add a your own CSS build pipeline (e.g postcss).
// import "../css/app.css";
```

## Adding some demo classes

Tailwind is now completely configured and ready to use. Let's take it for a spin and replace some of the default HTML with the following.

In `lib/phoenix_tailwind/templates/page/index.html.heex`:

```html
<section class="flex flex-col w-screen h-screen justify-center items-center">
  <h1 class="text-6xl font-black text-gray-200">
    Hello
    <span
      class="text-transparent bg-clip-text bg-gradient-to-br from-pink-600 to-red-200"
      >Tailwind</span
    >
  </h1>
  <p class="text-gray-200 text-xl mt-4">Let's get started!</p>
</section>
```

In `lib/phoenix_tailwind_web/templates/layout/root.html.heex` remove the existing header. It should then look like this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <%= csrf_meta_tag() %>
    <%= live_title_tag assigns[:page_title] || "PhoenixTailwind", suffix: " · Phoenix Framework" %>
    <link phx-track-static rel="stylesheet" href={Routes.static_path(@conn, "/assets/app.css")}/>
    <script defer phx-track-static type="text/javascript" src={Routes.static_path(@conn, "/assets/app.js")}></script>
  </head>
  <body>
    <%= @inner_content %>
  </body>
</html>
```

## (Re)start the server

We're now ready to take the new Phoenix app with Tailwind for a spin. Start the server with:

```bash
mix phx.server
```

And visit the page: http://localhost:4000/

You should see the following in your browser:

<Image
  alt={`Screenshot of the end result`}
  src={`/static/images/phoenix-tailwind.jpg`}
  width={1679}
  height={1351}
/>

I hope you found this tutorial useful and please let me know on Twitter if anything can be improved or is missing.

<Disclaimer>
  I was unable to get the Tailwind CSS IntelliSense plugin to work using this
  setup. It seems to rely on Tailwind being installed in the `node_modules`
  folder. There is an [open issue for this on
  Github](https://github.com/tailwindlabs/tailwindcss-intellisense/issues/448)
  and I will update this tutorial accordingly if there's a solution.
</Disclaimer>
