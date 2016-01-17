---
layout: post
title: Fish Shell- the missing config
tags: [shell]
share_image: https://i.imgur.com/Mc61zrr.png
share_description: Config to reuse environment variables and aliases from ~/.bash_profile in Fish Shell
---


After a long time using usual the Mac terminal I came to understanding
that more advanced tool is needed for many common aspects of daily work.

For example: some commands autosuggestions which will remember your previous commands
and be smart enough to repeat them depending on a situation. Another requirement from a UI-lover part of my soul-
good syntax highlighting. 

The best, if such tool wouldn't require much time for setup and configuration to start working out of the box.

After some research I settled on 2 options: [fish shell](http://fishshell.com/) and [Z shell (zsh)](http://zsh.sourceforge.net/).
Either are worth and have their advantages/disadvantages.

I decided to try Fish Shell as one of my biggest requirements installation without need of long configuration.
It's really something Fish was designed for.

<div class="more"></div>

If you are interested in Z shell starting guide and plugins- you can watch nice [manuals from Wes Bos](http://wesbos.com/command-line-video-tutorials/).

# Looking for the best terminal option
 
As I use Mac, there is not bad terminal inside OS X.

But sometimes you might need even more features:

* activate and focus terminal pressing HotKey anywhere,
* showing images right in the terminal (the best- together with animated GIFs),
* split panels ability
* flexible solution to have tons of setting in case you want to setup it exactly as you want.

There are a couple options but only one of them is good IMO- [ITerm](https://www.iterm2.com/).

So you can just download/install it and use ITerm instead of the terminal.

# Fish installation and first impressions

Just download and install Fish Shell from the official site: [http://fishshell.com/](http://fishshell.com/)

After that start Fish from your terminal running: `fish`

Try playing with autosuggestions and tabs- hope you'll like it.

If you want to change your default terminal to Fish,
you have to add Fish to `/etc/shells`, which will require an administrative password:

```bash
sudo echo /usr/local/bin/fish >> /etc/shells
```

And then make Fish your default shell with `chsh`:

```bash
chsh -s /usr/local/bin/fish
```

Only one problem I noticed after doing that- my environment variables and aliases from `~/.bash_profile` were not imported.
Ofc. you are free to declare Fish-specific variables/aliases but it's not something I would like to do,
especially if one day I'll switch to another shell or back to Bash.

After short research I just found an easy way to reuse them.

# The missing config to reuse Bash variables and aliases in Fish

To reuse Bash vars and aliases we would just parse `~/.bash_profile` and reapply them for Fish.
For that add the following scripts to the Fish config at `~/.config/fish/config.fish`:

```bash
# REUSE ALIASES FROM ~/.bash_profile
egrep "^alias " ~/.bash_profile | while read e
        set var (echo $e | sed -E "s/^alias ([A-Za-z_-]+)=(.*)\$/\1/")
        set value (echo $e | sed -E "s/^alias ([A-Za-z_-]+)=(.*)\$/\2/")

        # remove surrounding quotes if existing
        set value (echo $value | sed -E "s/^\"(.*)\"\$/\1/")

	# evaluate variables. we can use eval because we most likely just used "$var"
        set value (eval echo $value)

	# set an alias
	alias $var="$value"
end

# REUSE ENVIRONMENT VARIABLES FROM ~/.bash_profile
egrep "^export " ~/.bash_profile | while read e
	set var (echo $e | sed -E "s/^export ([A-Z_]+)=(.*)\$/\1/")
	set value (echo $e | sed -E "s/^export ([A-Z_]+)=(.*)\$/\2/")

	# remove surrounding quotes if existing
	set value (echo $value | sed -E "s/^\"(.*)\"\$/\1/")

	if test $var = "PATH"
		# replace ":" by spaces. this is how PATH looks for Fish
		set value (echo $value | sed -E "s/:/ /g")

		# use eval because we need to expand the value
		eval set -xg $var $value

		continue
	end

	# evaluate variables. we can use eval because we most likely just used "$var"
	set value (eval echo $value)

	#echo "set -xg '$var' '$value' (via '$e')"

	switch $value
        	case '`*`';
			# executable
			set NO_QUOTES (echo $value | sed -E "s/^\`(.*)\`\$/\1/")
			set -x $var (eval $NO_QUOTES)
		case '*'
			# default
			set -xg $var $value
        end
end
```

After that open a new tab and enjoy your Bash stuff working in Fish:

![alt](https://i.imgur.com/Mc61zrr.png)

The script idea was taken from [the SuperUser discussion](http://superuser.com/a/447777)
, improved and added with aliases import.

# Other additions to the config

## NVM (Node Version Manager) doesn't work in Fish out of the box

By default [NMV](https://github.com/creationix/nvm) (super handy tool to switch Node.js version on the fly) doesn't work.
But it's easy to fix using [NVM Fish wrapper](https://github.com/passcod/nvm-fish-wrapper).

For that in the terminal run:

```bash
cd ~/.config/fish

### copy the project files
git clone git://github.com/passcod/nvm-fish-wrapper.git nvm-wrapper
```

and edit your Fish config file:

```bash
vim ~/.config/fish/config.fish
```

adding nvm.fish there:

```
source ~/.config/fish/nvm-wrapper/nvm.fish
```

Open a new tab and try running `nvm`:

![nvm in fish](https://i.imgur.com/7GpgRfV.png)

## Repeat previous command and last command option are missed in Fish

If you a big fun of usage `sudo !!` when previous command requires administrative rights
or `!$` to repeat the last command option you'll notice they have to be added to Fish.

Fortunately the community already created a special page for this- [Bash Refugees](https://github.com/fish-shell/fish-shell/wiki/Bash-Refugees)

To add them back just create/edit the Fish user key binding:

```bash
vim ~/.config/fish/functions/fish_user_key_bindings.fish
```

and add the following:

```bash
function bind_bang
  switch (commandline -t)
  case "!"
    commandline -t $history[1]; commandline -f repaint
  case "*"
    commandline -i !
  end
end

function bind_dollar
  switch (commandline -t)
  case "!"
    commandline -t ""
    commandline -f history-token-search-backward
  case "*"
    commandline -i '$'
  end
end

function fish_user_key_bindings
  bind ! bind_bang
  bind '$' bind_dollar
end
```

### Fish Greeting

The default Fish intro is quite annoying IMO:
 
```
Welcome to fish, the friendly interactive shell

Type help for instructions on how to use fish
```

If you wish to remove it just add:

```bash
set fish_greeting ""
```

to your `~/.config/fish/config.fish`.

# Сonclusions

After that I started using Fish without even noticing I fully switched to it.
  
There might be some additional problems/disadvantages for you but for me Fish
exactly solves problems it was supposed to and so far I'm happy with it.

# Useful links

* [Fish Shell: the missing config at Github](https://github.com/malyw/fish-shell-the-missing-config)
* [Fish themes and additional packages](https://github.com/oh-my-fish/oh-my-fish)
* [Fish shell at Github](https://github.com/fish-shell/fish-shell)
