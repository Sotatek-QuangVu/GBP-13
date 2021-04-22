@contract class GRC721 {
    @state _name;
    @state _symbol;

    @state _owners = {};
    @state _balances = {};
    @state _tokenApprovals = {};
    @state _operatorApprovals = {};

    constructor(name_ : string, symbol_ : string) {
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
        if (ret === undefined) {
            throw new Error("GRC721: owner query for nonexistent token");
        }
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
            throw new Error("GRC721: approval to current owner");
        }
        if ((msg.sender !== to) && (this.isApprovedForAll(owner, msg.sender) === false)) {
            throw new Error("GRC721: approve caller is not owner nor approved for all");
        }
        this._approve(to, tokenId);
    }

    @view getApproved(tokenId : number) : string {
        if (this._exists(tokenId) === false) {
            throw new Error("GRC721: approved query for nonexistent token");
        }
        let ret = this._tokenApprovals[tokenId];
        if (ret === undefined) ret = "0";
        return ret;
    }

    @transaction setApprovalForAll(operator : string, approved : boolean) {
        if (msg.sender === operator) {
            throw new Error("GRC721: approve to caller");
        }
        this._operatorApprovals[msg.sender][operator] = approved;
    }

    @view isApprovedForAll(owner : string, operator) : boolean {
        return this._operatorApprovals[owner][operator];
    }

    @transaction transferFrom(from : string, to : string, tokenId : number) {
        if (this._isApprovedOrOwner(msg.sender, tokenId) === false) {
            throw new Error("GRC721: transfer caller is not owner nor approved");
        }
        this._transfer(from, to, tokenId);
    }

    _exists(tokenId : number) : boolean {
        return ((this._owners[tokenId] !== undefined) && (this._owners[tokenId] !== "0"));
    }

    _isApprovedOrOwner(spender : string,tokenId : number) : boolean {
        if (this._exists(tokenId) === false) {
            throw new Error("GRC721: operator query for nonexistent token");
        }
        let owner = this._owners[tokenId];
        return  (owner === spender || this.getApproved(tokenId) === spender || this.isApprovedForAll(owner, spender));
    }

    _mint(to : string, tokenId : number) {
        if (this._exists(tokenId)) {
            throw new Error("GRC721: token already minted");
        }
        this._beforeTokenTransfer("0", to, tokenId);
        this._balances[to] = (this._balances[to] === undefined ? 0 : this._balances[to]) + 1;
        this._owners[tokenId] = to;
    }

    _burn(tokenId : number) {
        let owner = this.ownerOf(tokenId);
        this._beforeTokenTransfer(owner, "0", tokenId);
        this._approve("0", tokenId);
        this._balances[owner] -= 1;
        this.owners[tokenId] = "0";
    }

    _transfer(from : string, to : string, tokeId : number) {
        if (this.ownerOf(tokeId) !== from) {
            throw new Error("GRC721: transfer of token that is not own");
        }
        if (to === undefined || to === "0") {
            throw new Error("GRC721: transfer to the zero address");
        }

        this._approve("0", tokenId);

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


