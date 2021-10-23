function getElements(modelElement){
    return async function (req, res) {
        try {
            let PromiseRequest;
            
            //1.) ------ myQuery ------ 
            if(req.query.myquery){
                PromiseRequest = modelElement.find(req.query.myquery);
            }else{
                PromiseRequest = modelElement.find();
            }
            
            // 2.) ----- SORT -------
            if(req.query.sort){
                PromiseRequest = PromiseRequest.sort(req.query.sort);
            }

            // 3.) ----- Filter ----   eg: name % price
            if(req.query.select){
                let params = req.query.select("%").join(" ")
                PromiseRequest = PromiseRequest.select(params)
            }
            
            let page = Number(req.body.page) || 1;
            let limit = Number(req.query.limit) || 4;
            let toSkip = (page-1) * limit;
            PromiseRequest = PromiseRequest.skip(toSkip).limit(limit);

            let elements = await PromiseRequest;
            if (elements) {
                return res.status(200).json({ 
                    elements
                });
            } else {
                return res.status(200).json({
                    message: 'users not found'
                });
            }
            
        } catch (err) {
            res.status(502).json({
                message: err.message
            })
        }
    }
}

function createElement(elementModel){
    console.log('createElement inide')
    return async function (req, res) {
        try{
            let element = await elementModel.create(req.body);
            res.status(200).json({
                element:element,
                "message":"user created"
            })
        }catch (err) {
            res.status(502).json({
                message: err.message
            })
        }
    }
}

function getElement(elementModel){
    return async function (req, res) {
        try{
            let {id} = req.params
            let element = await elementModel.findById(id)
            if(element){
                res.status(200).json({
                    "message":"user found",
                    element:element
                })
            }else{
                res.status(404).json({
                    "message":"user Not found"
                })
            }
        }catch (err) {
            res.status(502).json({
                message: err.message
            })
        }
    }
}


function deleteElement(elementModel){
    return async function(req, res) {
        try{
            let {id} = req.params;
            let element = await elementModel.findByIdAndDelete(id)
            if(element){
                res.status(200).json({
                    "message":"user deleted",
                    element:element
                })
            }else{
                res.status(404).json({
                    "message":"user not found"
                })
            }
        }catch (err) {
            res.status(502).json({
                message: err.message
            })
        }
    }
}

function updateElement(elementModel){
    return async function(req, res) {
        try{
            let {id} = req.params;
            let element = await elementModel.findById(id);
            if(element){
                
                for(let key in req.body){
                    element[key] = req.body[key]
                }
    
                await element.save({validateBeforeSave:false})
                
                res.status(200).json({
                    "message":"user updated",
                    element:element
                })
            }else{
                res.status(404).json({
                    "message":"user not found"
                })
            }
        }catch(err){
            res.status(502).json({
                message: err.message
            })
        }
    };
}

module.exports.getElements = getElements;
module.exports.createElement = createElement;
module.exports.getElement = getElement;
module.exports.deleteElement = deleteElement;
module.exports.updateElement = updateElement;


