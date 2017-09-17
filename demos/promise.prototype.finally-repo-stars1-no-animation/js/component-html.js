const componentHTML = `
    <div class="component-content">
        <h4 class="component-title"></h4>

        <form class="form-inline">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" required class="form-control" id="username" placeholder="Username:" value="facebook">
            </div>
            <div class="form-group">
                <label for="reponame">Repo name:</label>
                <input type="text" required class="form-control" id="reponame" placeholder="Repo name:" value="react">
            </div>
            <div class="form-group">
                <label>​</label>
                <button type="submit" class="btn btn-primary">Get number of stars</button>
            </div>
        </form>
    </div>


    <h5>
        Stars number:
        <span class="stars-number"></span>
    </h5>

    <div class="component-loader">
        <div class="component-loader-animation"></div>
    </div>
`;

const componentElForHTML = document.querySelector(".component");
componentElForHTML.innerHTML = componentHTML;