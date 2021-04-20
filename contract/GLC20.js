@contract class GLC20 {
    @state _balances = {};
    @state _allowances = {};

    @view @state _totalSupply;
    @view @state _name;
    @view @state _symbol;
    @view @state _decimals;

     constructor(name_ : string, symbol_ : string, totalSupply_ : number, decimals_ : number) {
        this._name = name_;
        this._symbol = symbol_;
        this._totalSupply = totalSupply_;
        this._decimals = decimals_;
        this._balances[msg.sender] = totalSupply_;
    }

    @view balancesOf(account : string) : number {
        let money = this._balances[user];
        if (money === undefined) money = 0;
        return money;
    }

    @transaction transfer(recipient : string, amount : number) : boolean {
        this._transfer(msg.sender, recipient, amount);
        return true;
    }

    @view allowance(owner : string, spender : string) {
        let ret = this._allowances[owner][spender];
        if (ret === undefined) {
            ret = 0;
        }
        return ret;
    }

    @transaction approve(spender : string, amount : number) : boolean {
        this._approve(msg.sender, spender, amount);
        return true;
    }

    @transaction transferFrom(sender : string, recipient : string, amount : number) : boolean {
        this._transfer(sender, recipient, amount);

        let currentAllowance = this._allowances[sender][recipient];
        if (currentAllowance === undefined) {
            currentAllowance = 0;
        }
        if (currentAllowance < amount) {
            throw new Error('amount greater than currentAllowance')
        }
        this._approve(sender, msg.sender, currentAllowance - amount);
        return true;
    }

    @transaction increaseAllowance(spender : string, addedValue : number) : boolean {
        let currentAllowance = this._allowances[msg.sender][spender];
        if (currentAllowance === undefined) currentAllowance = 0;
        _approve(msg.sender, spender, this._allowances[msg.sender][spender] + addedValue);
        return true;
    }

    @transaction decreaseAllowance(spender : string, subtractedValue : number) : boolean {
        let currentAllowance = this._allowances[msg.sender][spender];
        if (currentAllowance === undefined) currentAllowance = 0;
        if (currentAllowance < subtractedValue) {
            throw new Error('subtractedValue greater than currentAllowance of sender')
        }

        _approve(msg.sender, spender, currentAllowance - subtractedValue);
        return true;
    }

    _transfer(sender : string, recipient : string, amount : number) {
        let senderBalance = this._balances[sender];
        if (senderBalance === undefined) senderBalance = 0;
        if (senderBalance < amount) {
            throw new Error('senderBalance smaller than amount');
        }
        this._balances[sender] = senderBalance - amount;

        if (this._balances[recipient] === undefined) {
            this._balances[recipient] = 0;
        }

        this._balances[recipient] += amount;
    }

    _mint(account : string, amount : number) {
        _beforeTokenTransfer("", account, amount);
        this._totalSupply += amount;
        this._balances[account] += amount;
    }

    _burn(account : string, amount : number) {
        this._beforeTokenTransfer(account, "", amount);

        let accountBalance = this._balances[account];
        if (accountBalance === undefined) {
            accountBalance = 0;
        }
        if (accountBalance < amount) {
            throw new Error("amount to large");
        }
        this._balances[account] = accountBalance - amount;
        this._totalSupply -= amount;
    }

    _approve(owner : string, spender : string, amount : number) {
        this._allowances[owner][spender] = amount;
    }

    _beforeTokenTransfer(from : string, to : string, amount : number) {

    }

}
