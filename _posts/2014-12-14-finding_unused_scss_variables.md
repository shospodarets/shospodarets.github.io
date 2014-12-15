---
layout: post
title: Finding unused SCSS variables
tags: [CSS, SASS]
---

When you have big project with many files and dependencies, usually you should care about good code base and periodic cleaning / refactoring.
The same situation I had when decided to refactor SCSS files- structure, naming and variables...

I was surprised when figured out- there aren't good instruments to find unused SCSS variables.

The ways they appear is usual:
<ul>
    <li>
        somebody removed use of variable but forgot to delete declaration
    </li>
    <li>
        it was used for declaration of another variable or inside some expression
    </li>
    <li>
        someone added it "for future" or decided to use variable later
    </li>
    <li>
        etc.
</ul>

<div class="more"></div>

<h2>Solution</h2>
So was decided just to create simple shell script to find SCSS-syntax variables which appear in the code only one time.
Here it is:
{% gist malyw/fade28c8d398a3a86334 %}

<h2>How to use</h2>

Let's imagine you have folder "sass" where are SCSS files of your project. Then:

<ol>
    <li>
        Create file "find_unused_variables.sh" in the parent folder of "sass"
    </li>
    <li>
        Copy and paste content from solution script to it
    </li>
    <li>
        Open the parent folder of "sass" in your terminal
    </li>
    <li>
        Run the following command to do this file executable:
        {% highlight bash %}
        chmod +x ./find_unused_variables.sh
        {% endhighlight %}
    </li>
    <li>
        Run the script:
        {% highlight bash %}
        ./find_unused_variables.sh ./sass
        {% endhighlight %}
    </li>
    <li>
        As result you will have in the shell list of the unused SCSS variables
    </li>
</ol>
<img src="http://i.imgur.com/1o0jhwL.gif" alt=""/>


<h2>N.B.</h2>
When you use in your codebase some 3rd party libraries variables (e.g. "susy" to provide settings for it)-
script will also show them as unused because they might appear only once in the folder with your SCSS code.