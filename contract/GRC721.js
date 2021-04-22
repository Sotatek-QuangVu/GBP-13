@contract class GRC721 {
    @state _name;
    @state _symbol;

    @state _owners = {};
    @state _balances = {};
    @state _tokenApprovals = {};
    @state _operatorApprovals = {};

    @transaction CONSTRUCTOR(name_ : string, symbol_ : string) {
        this._name = name_;
        this._symbol = symbol_;
    }

    @view balanceOf(owner : string) : number {
        let ret = this._balances[owner];
        if (ret === undefined) ret = 0;
        return ret;
    }

    @view ownerOf(tokenId : number) : string {
        let ret = this._owners[tokenId];
        if (ret === undefined) ret = "";
        return ret;
    }

    @view name() : string {
        return this._name;
    }

    @view symbol() : string {
        return this._symbol;
    }

    @transaction approve(to : string, tokenId: number) {
        let owner = this.ownerOf(tokenId);
        if (owner === to) {
            return;
        }
        if ((msg.sender !== to) && (this.isApprovedForAll(owner, msg.sender) === false)) {
            return;
        }
        this._approve(to, tokenId);
    }

    @view getApproved(tokenId : number) : string {
        if (this._exists(tokenId) === false) {
            return "Not exist tokenId!";
        }
        let ret = this._tokenApprovals[tokenId];
        if (ret === undefined) ret = "";
        return ret;
    }

    @transaction setApprovalForAll(operator : string, approved : boolean) {
        if (msg.sender === operator) {
            return;
        }
        this._operatorApprovals[msg.sender][operator] = approved;
    }

    @view isApprovedForAll(owner : string, operator) : boolean {
        return this._operatorApprovals[owner][operator];
    }

    @view _exists(tokenId : number) : boolean {
        return ((this._owners[tokenId] !== undefined) && (this._owners[tokenId] !== ""));
    }

    @view _isApprovedOrOwner(spender : string,tokenId : number) : boolean {
        let owner = this._owners[tokenId];
        return  (owner === spender || this.getApproved(tokenId) === spender || this.isApprovedForAll(owner, spender));
    }

    @transaction _mint(to : string, tokenId : number) {
        if (this._exists(tokenId)) {
            return;
        }
        this._beforeTokenTransfer("", to, tokenId);
        this._balances[to] = (this._balances[to] === undefined ? 0 : this._balances[to]) + 1;
        this._owners[tokenId] = to;
    }

    @transaction _burn(tokenId : number) {
        let owner = this.ownerOf(tokenId);
        this._beforeTokenTransfer(owner, "", tokenId);
        this._approve("", tokenId);
        this._balances[owner] -= 1;
        this.owners[tokenId] = "";
    }

    _transfer(from : string, to : string, tokeId : number) {
        if (this.ownerOf(tokeId) !== from) {
            return;
        }
        if (to === undefined || to === "") {
            return;
        }

        this._approve("", tokenId);

        this._balances[from] -= 1;
        this._balances[to] = (this._balances[to] === undefined ? 0 : this._balances[to]) + 1;
        this._owners[tokenId] = to;
    }

    _approve(to : string, tokenId : number) {
        this._tokenApprovals[tokenId] = to;
    }

    @transaction _beforeTokenTransfer(from : string, to : string, tokenId : number) {

    }


}


