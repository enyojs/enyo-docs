% Dupliforking

This document describes a way to "fork" a project multiple times, which we call "dupliforking".

## Why Duplifork?

We invented this process because GitHub will only allow one fork per project, per organization.

Since a person might want to make more than one app using the [Bootplate](bootplate.html)
template, we needed a way to enable this.

## Instructions

The following command-line instructions should work on Mac OS X, Linux, and Windows
if the [official Git client](http://git-scm.com/download/win) is installed.

Let's say you want to create a new app called "MillionDollars".

1. Clone the bootplate repository and enter the directory.

        git clone https://github.com/enyojs/bootplate.git MillionDollars

        cd MillionDollars

2. Initialize the subrepositories.

        git submodule update --init

3. Create a new GitHub repository for your app.

    [Click Here](https://github.com/repositories/new)

4. Point your clone of bootplate at your new GitHub repository.  (This step changes where the code is pushed to and pulled from.)

        git remote set-url origin git@github.com:<your user name>/MillionDollars.git

    Users of other tools may just edit the config file, `MillionDollars/.git/config`:

        [remote "origin"]
            url = git@github.com:<your user name>/MillionDollars.git
            ...

5. Push to your new repository.

You're all set!

## Notes

The git version on older machines may not be up to the task. You'll know you fall into this if when you try the ``git submodule update --init`` command, you get git's helpful "usage" message. Worse, the git version available from the distribution's repository isn't at all recent, so just ``apt-get upgrade git-core`` isn't going to help.

In order to get this working on some internal build machines, we had to do the following:

        sudo apt-get install curl libcurl4-openssl-dev libexpat1-dev gettext asciidoc expat
        git clone git://github.com/git/git.git
        sudo apt-get remove git-core
        make prefix=/usr CURLDIR=/usr/bin NO_R_TO_GCC_LINKER=YesPlease EXPATDIR=/usr/lib all 
        sudo make prefix=/usr CURLDIR=/usr/bin NO_R_TO_GCC_LINKER=YesPlease EXPATDIR=/usr/lib install
        git config --global http.sslVerify false

We can't guarantee this will help, and do note that it involves replacing whatever version of git you currently have with the current dev version from github, but it works for us.

References:

* http://scottschulz.us/2008/06/07/ubuntu-hardy-the-10-minute-git-install/
* http://git.661346.n2.nabble.com/fatal-Unable-to-find-remote-helper-for-http-tp5041606p5043357.html
* http://stackoverflow.com/a/8755199